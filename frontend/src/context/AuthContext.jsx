import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginUser, logoutUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const result = await fetchMe();
        if (mounted) {
          setUser(result.data?.user || null);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(payload) {
    const result = await loginUser(payload);
    setUser(result.data?.user || null);
    return result;
  }

  async function register(payload) {
    const result = await registerUser(payload);
    setUser(result.data?.user || null);
    return result;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
export default AuthProvider;