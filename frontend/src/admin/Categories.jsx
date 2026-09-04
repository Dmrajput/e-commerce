import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

const initialForm = {
  name: "",
  slug: "",
  image: "",
  status: "active",
};

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCategories() {
    setLoading(true);
    setError("");
    try {
      const result = await getCategories({ includeInactive: true });
      setCategories(result.data?.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      image: category.image || "",
      status: category.status || "active",
    });
  }

  function handleReset() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      handleReset();
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  }

  return (
    <section>
      <h2>Admin Categories</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Slug
          <input type="text" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-from-name" />
        </label>

        <label>
          Image URL
          <input type="text" name="image" value={form.image} onChange={handleChange} />
        </label>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </label>

        {error ? <p className="status-fail">{error}</p> : null}

        <div className="row-actions">
          <button type="submit">{editingId ? "Update" : "Add"} Category</button>
          {editingId ? (
            <button type="button" onClick={handleReset}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {loading ? <p>Loading...</p> : null}

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.status}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(category._id)}>
                    Delete/Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminCategories;