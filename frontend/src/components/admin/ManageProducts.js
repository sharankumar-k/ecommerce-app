import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";
import getLocalImage from "../../api/localImages";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    imageUrl: "",
  });
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch {
      toast.error("Failed to load products");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Reset Form
  const resetForm = () => {
    setForm({ name: "", price: "", categoryId: "", imageUrl: "" });
    setPreview("");
    setEditing(null);
  };

  // Auto-preview based on name/category
  useEffect(() => {
    const catObj = categories.find((c) => c.id === parseInt(form.categoryId));
    const img =
      form.imageUrl?.trim() ||
      getLocalImage(form.name, catObj?.name || "");
    setPreview(img);
  }, [form.name, form.categoryId, form.imageUrl, categories]);

  // Add or Update Product
  const addOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const catObj = categories.find((c) => c.id === parseInt(form.categoryId));
      const finalImage =
        form.imageUrl?.trim() ||
        getLocalImage(form.name, catObj?.name || "");

      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
        imageUrl: finalImage,
      };

      if (editing) {
        await api.put(`/products/update/${editing}`, payload);
        toast.success("✅ Product updated");
      } else {
        await api.post("/products/add", payload);
        toast.success("✅ Product added");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Save failed");
    }
  };

  // Edit Product
  const startEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      price: p.price,
      categoryId: p.categoryId || "",
      imageUrl: p.imageUrl || "",
    });
    setPreview(p.imageUrl || getLocalImage(p.name));
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      toast.success("🗑️ Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <h3 className="mb-4">🛍 Manage Products</h3>

      {/* ===== Product Form ===== */}
      <form onSubmit={addOrUpdateProduct} className="mb-4 w-75">
        <input
          className="form-control mb-2"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <select
          className="form-select mb-2"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
        >
          <option value="">Choose category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="form-control mb-3"
          placeholder="Paste image URL (optional)"
          type="text"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        {/* Live Preview */}
        <div className="mb-3 text-center">
          <img
            src={preview || "/assets/products/placeholder.png"}
            alt="Preview"
            className="img-thumbnail"
            style={{
              maxHeight: "150px",
              maxWidth: "150px",
              objectFit: "contain",
              background: "#fff",
            }}
          />
        </div>

        <button className="btn btn-success me-2" type="submit">
          {editing ? "Update Product" : "Add Product"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* ===== Product List ===== */}
      <ul className="list-group w-100">
        {products.map((p) => (
          <li
            key={p.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={p.imageUrl || getLocalImage(p.name, p.categoryName)}
                alt={p.name}
                className="rounded"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                  background: "#f9f9f9",
                  border: "1px solid #eee",
                }}
              />
              <div>
                <strong>{p.name}</strong> — ₹{p.price}
                <div className="text-muted small">{p.categoryName}</div>
              </div>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => startEdit(p)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteProduct(p.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default ManageProducts;
