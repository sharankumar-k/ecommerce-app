
package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.category.CategoryRequestDTO;
import com.sharan.ecommerce.dto.category.CategoryResponseDTO;
import com.sharan.ecommerce.model.Category;
import com.sharan.ecommerce.model.Product;
import com.sharan.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all categories
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get category by ID
    public CategoryResponseDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
        return convertToResponseDTO(category);
    }

    // Get products in category
    public Set<Product> getProductsByCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
        return category.getProducts();
    }

    // Add new category
    public CategoryResponseDTO addCategory(CategoryRequestDTO dto) {
        Category category = new Category(dto.getName(), dto.getDescription());
        return convertToResponseDTO(categoryRepository.save(category));
    }

    // Update category
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return convertToResponseDTO(categoryRepository.save(category));
    }

    // Delete category
    public boolean deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) return false;
        categoryRepository.deleteById(id);
        return true;
    }

    // Convert entity to DTO
    private CategoryResponseDTO convertToResponseDTO(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setProductCount(category.getProducts() != null ? category.getProducts().size() : 0);
        return dto;
    }
}