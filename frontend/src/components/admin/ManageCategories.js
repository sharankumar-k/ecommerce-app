// src/components/admin/ManageCategories.js
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null); // id if editing

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Couldn't load categories");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim()) return toast.warn("Enter category name");
      // Backend expects POST /api/categories/add (per your controller) — adjust if different
      const res = await api.post("/categories/add", { name });
      toast.success("Category added");
      setName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data || "Add failed");
    }
  };

  const startEdit = (c) => {
    setEditing(c.id);
    setName(c.name);
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/categories/update/${editing}`, { name });
      toast.success("Category updated");
      setEditing(null);
      setName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await api.delete(`/categories/delete/${id}`);
      toast.success("Deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <h3>Manage Categories</h3>

      <form onSubmit={editing ? updateCategory : addCategory} className="mb-3 d-flex gap-2">
        <input className="form-control w-50" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
        <button className="btn btn-primary" type="submit">{editing ? "Update" : "Add"}</button>
        {editing && <button className="btn btn-secondary" onClick={() => { setEditing(null); setName(""); }} type="button">Cancel</button>}
      </form>

      <ul className="list-group w-50">
        {categories.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            {c.name}
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(c)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCategory(c.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default ManageCategories;
