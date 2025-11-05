package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.user.UserRequestDTO;
import com.sharan.ecommerce.dto.user.UserResponseDTO;
import com.sharan.ecommerce.exception.ResourceNotFoundException;
import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return convertToResponseDTO(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public UserResponseDTO addUser(UserRequestDTO dto) {
        User user = new User(
                dto.getName(), // Split into firstName/lastName if needed
                "", // lastName placeholder
                dto.getEmail(),
                dto.getPassword(),
                null,
                null
        );
        return convertToResponseDTO(userRepository.save(user));
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setFirstName(dto.getName()); // Update name
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        return convertToResponseDTO(userRepository.save(user));
    }

    @Override
    public boolean deleteUser(Long id) {
        if (!userRepository.existsById(id)) return false;
        userRepository.deleteById(id);
        return true;
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getId());
        dto.setName(user.getFirstName() + " " + user.getLastName());
        dto.setEmail(user.getEmail());
        return dto;
    }
}