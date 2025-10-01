package com.bms.restaurant_system;

import com.bms.restaurant_system.dto.UserResponseDTO;
import com.bms.restaurant_system.entity.Role;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.repository.UserRepository;
import com.bms.restaurant_system.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceTest {
    @Autowired
    private UserService userService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Given
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("testuser1");
        user1.setEmail("test1@example.com");
        user1.setRole(Role.USER);

        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("testuser2");
        user2.setEmail("test2@example.com");
        user2.setRole(Role.ADMIN);

        List<User> mockUsers = Arrays.asList(user1, user2);
        when(userRepository.findAll()).thenReturn(mockUsers);

        // When
        List<UserResponseDTO> users = userService.getAllUsers();

        // Then
        assertEquals(2, users.size());
        assertEquals("testuser1", users.get(0).username());
        assertEquals("testuser2", users.get(1).username());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_ShouldReturnUser_WhenUserExists() {
        // Given
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@example.com");
        mockUser.setRole(Role.USER);

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // When
        UserResponseDTO user = userService.getUserById(1L);

        // Then
        assertNotNull(user);
        assertEquals("testuser", user.username());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_ShouldThrowException_WhenUserDoesNotExist() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(Exception.class, () -> {
            userService.getUserById(1L);
        });
        verify(userRepository, times(1)).findById(1L);
    }
}
