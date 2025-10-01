package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.DeliveryDriverDTO;
import com.bms.restaurant_system.entity.DeliveryDriver;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.DeliveryDriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryDriverService {
    @Autowired
    private DeliveryDriverRepository deliveryDriverRepository;

    public List<DeliveryDriverDTO> getAllDeliveryDrivers() {
        return deliveryDriverRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDriverDTO getDeliveryDriverById(Long id) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + id));
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO createDeliveryDriver(DeliveryDriverDTO deliveryDriverDTO) {
        DeliveryDriver driver = convertToEntity(deliveryDriverDTO);
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO updateDeliveryDriver(Long id, DeliveryDriverDTO deliveryDriverDTO) {
        DeliveryDriver existingDriver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + id));
        existingDriver.setName(deliveryDriverDTO.name());
        existingDriver.setPhone(deliveryDriverDTO.phone());
        existingDriver.setVehicleNumber(deliveryDriverDTO.vehicleNumber());
        existingDriver.setStatus(deliveryDriverDTO.status());
        existingDriver = deliveryDriverRepository.save(existingDriver);
        return convertToDTO(existingDriver);
    }

    public void deleteDeliveryDriver(Long id) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + id));
        deliveryDriverRepository.delete(driver);
    }

    private DeliveryDriverDTO convertToDTO(DeliveryDriver driver) {
        return new DeliveryDriverDTO(
                driver.getId(),
                driver.getName(),
                driver.getPhone(),
                driver.getVehicleNumber(),
                driver.getStatus()
        );
    }

    private DeliveryDriver convertToEntity(DeliveryDriverDTO dto) {
        DeliveryDriver driver = new DeliveryDriver();
        driver.setName(dto.name());
        driver.setPhone(dto.phone());
        driver.setVehicleNumber(dto.vehicleNumber());
        driver.setStatus(dto.status());
        return driver;
    }
}
