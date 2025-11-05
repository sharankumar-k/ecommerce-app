
package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.user.UserRequestDTO;
import com.sharan.ecommerce.dto.user.UserResponseDTO;

import java.util.List;

public interface UserService {

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    boolean existsByEmail(String email);

    UserResponseDTO addUser(UserRequestDTO dto);

    UserResponseDTO updateUser(Long id, UserRequestDTO dto);

    boolean deleteUser(Long id);
}