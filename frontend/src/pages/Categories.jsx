import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getCategories();
        setCategories(result.data?.categories || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load categories");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p className="status-fail">{error}</p>;
  }

  return (
    <section>
      <h2>Categories</h2>
      {categories.length === 0 ? <p>No active categories available.</p> : null}
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category._id}>
            <Link to={`/categories/${category._id}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Categories;