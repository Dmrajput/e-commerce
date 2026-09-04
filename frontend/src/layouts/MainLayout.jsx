import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>ECommerce</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile</Link>
              {user?.role === "admin" ? <Link to="/admin/categories">Admin Categories</Link> : null}
              <button type="button" className="link-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
