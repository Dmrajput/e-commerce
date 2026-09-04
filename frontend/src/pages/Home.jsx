import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [health, setHealth] = useState({
    loading: true,
    ok: false,
    message: "Checking backend connection...",
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await api.get("/health");
        setHealth({
          loading: false,
          ok: true,
          message: response.data?.message || "Backend connected",
        });
      } catch (error) {
        setHealth({
          loading: false,
          ok: false,
          message: "Backend not reachable. Make sure backend is running.",
        });
      }
    }

    checkHealth();
  }, []);

  return (
    <section>
      <h2>Home</h2>
      <p>Phase 1 foundation is ready.</p>
      <p>
        Backend status:{" "}
        <strong className={health.ok ? "status-ok" : "status-fail"}>
          {health.loading ? "Loading..." : health.message}
        </strong>
      </p>
      <p>
        Browse categories: <Link to="/categories">View Category Listing</Link>
      </p>
    </section>
  );
}

export default Home;
