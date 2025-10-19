package com.bms.restaurant_system.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Service for handling file storage in the resources/static/images directory
 * Stores payment slips and menu item images in organized subdirectories
 */
@Service
public class FileStorageService {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);
    
    // Base directory for all images in resources
    private static final String BASE_UPLOAD_DIR = "src/main/resources/static/images/";
    
    // Subdirectories for different types of images
    private static final String PAYMENT_SLIPS_DIR = "payment-slips/";
    private static final String MENU_ITEMS_DIR = "menu/";
    
    // Maximum file sizes
    private static final long MAX_PAYMENT_SLIP_SIZE = 10 * 1024 * 1024; // 10MB
    private static final long MAX_MENU_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    
    /**
     * Store payment slip image with date-based organization
     * @param file The multipart file to store
     * @param orderId The order ID for reference
     * @return The relative URL path to access the stored file
     * @throws IOException If file storage fails
     */
    public String storePaymentSlip(MultipartFile file, Long orderId) throws IOException {
        logger.info("Storing payment slip for order: {}", orderId);
        
        // Validate file
        validateFile(file, MAX_PAYMENT_SLIP_SIZE, true);
        
        // Create date-based subdirectory (e.g., payment-slips/2025-10/)
        String yearMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        String uploadPath = BASE_UPLOAD_DIR + PAYMENT_SLIPS_DIR + yearMonth + "/";
        
        // Store file and return URL
        String filename = storeFile(file, uploadPath, "payment_order_" + orderId);
        String imageUrl = "/images/" + PAYMENT_SLIPS_DIR + yearMonth + "/" + filename;
        
        logger.info("Payment slip stored successfully: {}", imageUrl);
        return imageUrl;
    }
    
    /**
     * Store menu item image
     * @param file The multipart file to store
     * @return The relative URL path to access the stored file
     * @throws IOException If file storage fails
     */
    public String storeMenuImage(MultipartFile file) throws IOException {
        logger.info("Storing menu item image: {}", file.getOriginalFilename());
        
        // Validate file
        validateFile(file, MAX_MENU_IMAGE_SIZE, false);
        
        // Store file in menu directory
        String uploadPath = BASE_UPLOAD_DIR + MENU_ITEMS_DIR;
        String filename = storeFile(file, uploadPath, "menu_item");
        String imageUrl = "/images/" + MENU_ITEMS_DIR + filename;
        
        logger.info("Menu image stored successfully: {}", imageUrl);
        return imageUrl;
    }
    
    /**
     * Generic file storage method
     * @param file The file to store
     * @param uploadPath The directory path to store the file
     * @param prefix Filename prefix for organization
     * @return The generated filename
     * @throws IOException If storage fails
     */
    private String storeFile(MultipartFile file, String uploadPath, String prefix) throws IOException {
        // Create directory if it doesn't exist
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            logger.info("Created directory: {}", uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be null or empty");
        }
        
        String fileExtension = getFileExtension(originalFilename);
        String timestamp = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String uniqueFilename = prefix + "_" + timestamp + "_" + uniqueId + fileExtension;
        
        // Save file
        Path targetPath = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        
        logger.info("File stored at: {}", targetPath);
        return uniqueFilename;
    }
    
    /**
     * Validate uploaded file
     * @param file The file to validate
     * @param maxSize Maximum allowed file size
     * @param allowPdf Whether to allow PDF files (for payment slips)
     * @throws IllegalArgumentException If validation fails
     */
    private void validateFile(MultipartFile file, long maxSize, boolean allowPdf) {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        // Check file size
        if (file.getSize() > maxSize) {
            long maxSizeMB = maxSize / (1024 * 1024);
            throw new IllegalArgumentException("File size must be less than " + maxSizeMB + "MB");
        }
        
        // Check content type
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("Unable to determine file type");
        }
        
        boolean isValid = contentType.startsWith("image/");
        if (allowPdf) {
            isValid = isValid || contentType.equals("application/pdf");
        }
        
        if (!isValid) {
            if (allowPdf) {
                throw new IllegalArgumentException("Only image files (JPEG, PNG, GIF) and PDF files are allowed");
            } else {
                throw new IllegalArgumentException("Only image files (JPEG, PNG, GIF) are allowed");
            }
        }
    }
    
    /**
     * Get file extension from filename
     * @param filename The original filename
     * @return The file extension with dot (e.g., ".jpg")
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    /**
     * Delete a stored file
     * @param fileUrl The relative URL of the file to delete
     * @return true if deletion was successful, false otherwise
     */
    public boolean deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty()) {
                return false;
            }
            
            // Convert URL to file path
            String filePath = fileUrl.replace("/images/", BASE_UPLOAD_DIR);
            Path path = Paths.get(filePath);
            
            if (Files.exists(path)) {
                Files.delete(path);
                logger.info("Deleted file: {}", fileUrl);
                return true;
            } else {
                logger.warn("File not found for deletion: {}", fileUrl);
                return false;
            }
        } catch (IOException e) {
            logger.error("Error deleting file {}: {}", fileUrl, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get the full file path from a URL
     * @param fileUrl The relative URL
     * @return The full file system path
     */
    public Path getFilePath(String fileUrl) {
        String filePath = fileUrl.replace("/images/", BASE_UPLOAD_DIR);
        return Paths.get(filePath);
    }
}
