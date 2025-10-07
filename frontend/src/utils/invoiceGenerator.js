import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatPrice } from './currency';

export const generateInvoice = (orderData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Header
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('BMS Kingdom of Taste', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Restaurant Invoice', pageWidth / 2, 30, { align: 'center' });
      
      // Order details
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('INVOICE', 20, 50);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Invoice #: ${orderData.id}`, 20, 60);
      doc.text(`Date: ${new Date(orderData.orderDate).toLocaleDateString()}`, 20, 70);
      doc.text(`Status: ${orderData.status.toUpperCase()}`, 20, 80);
      
      // Customer information
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Bill To:', 20, 100);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`${orderData.deliveryInfo.fullName}`, 20, 110);
      doc.text(`${orderData.deliveryInfo.email}`, 20, 120);
      doc.text(`${orderData.deliveryInfo.phone}`, 20, 130);
      doc.text(`${orderData.deliveryInfo.address}`, 20, 140);
      doc.text(`${orderData.deliveryInfo.city}`, 20, 150);
      
      // Items table header
      let yPosition = 170;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Item', 20, yPosition);
      doc.text('Qty', 120, yPosition);
      doc.text('Price', 140, yPosition);
      doc.text('Total', 170, yPosition);
      
      // Draw line under header
      doc.line(20, yPosition + 5, 190, yPosition + 5);
      yPosition += 15;
      
      // Items
      doc.setFont(undefined, 'normal');
      orderData.items.forEach((item) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(item.name.substring(0, 30), 20, yPosition);
        doc.text(item.quantity.toString(), 120, yPosition);
        doc.text(formatPrice(item.price), 140, yPosition);
        doc.text(formatPrice(item.price * item.quantity), 170, yPosition);
        yPosition += 10;
      });
      
      // Totals
      yPosition += 10;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      doc.text(`Subtotal:`, 120, yPosition);
      doc.text(formatPrice(orderData.subtotal), 170, yPosition);
      yPosition += 10;
      
      doc.text(`Tax (6%):`, 120, yPosition);
      doc.text(formatPrice(orderData.tax), 170, yPosition);
      yPosition += 10;
      
      doc.text(`Delivery:`, 120, yPosition);
      doc.text(`Free`, 170, yPosition);
      yPosition += 15;
      
      doc.setFont(undefined, 'bold');
      doc.text(`TOTAL:`, 120, yPosition);
      doc.text(formatPrice(orderData.total), 170, yPosition);
      
      // Payment method
      yPosition += 20;
      doc.setFont(undefined, 'normal');
      doc.text(`Payment Method: ${orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Deposit'}`, 20, yPosition);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('BMS Kingdom of Taste - Serving excellence since 2025', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      resolve(doc);
    } catch (error) {
      reject(error);
    }
  });
};

export const downloadInvoice = async (orderData, filename = null) => {
  try {
    const doc = await generateInvoice(orderData);
    const fileName = filename || `invoice-${orderData.id}.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating invoice:', error);
    return false;
  }
};

export const generateInvoiceFromHTML = async (elementId, orderData) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    doc.save(`invoice-${orderData.id}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating invoice from HTML:', error);
    return false;
  }
};