package com.sharan.ecommerce.controller;

import com.sharan.ecommerce.model.Role;
import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.repository.UserRepository;
import com.sharan.ecommerce.util.JWTUtil;
import com.sharan.ecommerce.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private PasswordEncoderUtil passwordEncoderUtil;

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        // Hash the password
        user.setPassword(passwordEncoderUtil.encode(user.getPassword()));

        // Always set role to USER on registration
        user.setRole(Role.USER);

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        User dbUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoderUtil.matches(user.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(dbUser.getEmail(), dbUser.getRole().name());

        // Send structured response to frontend
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", dbUser.getRole().name());
        response.put("email", dbUser.getEmail());
        response.put("firstName", dbUser.getFirstName());
        response.put("lastName", dbUser.getLastName());

        return ResponseEntity.ok(response);
    }
}