package com.bms.restaurant_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class RestaurantSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantSystemApplication.class, args);
	}

}
