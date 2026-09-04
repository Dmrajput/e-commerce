import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById } from "../services/categoryService";

function CategoryDetails() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategory() {
      try {
        const result = await getCategoryById(id);
        setCategory(result.data?.category || null);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load category");
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [id]);

  if (loading) {
    return <p>Loading category...</p>;
  }

  if (error) {
    return <p className="status-fail">{error}</p>;
  }

  if (!category) {
    return <p>Category not found.</p>;
  }

  return (
    <section>
      <h2>{category.name}</h2>
      <p>Slug: {category.slug}</p>
      <p>Status: {category.status}</p>
      {category.image ? <p>Image URL: {category.image}</p> : <p>No image set.</p>}
    </section>
  );
}

export default CategoryDetails;