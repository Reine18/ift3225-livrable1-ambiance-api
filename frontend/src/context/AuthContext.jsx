import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:3000/users";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("ambiance_token");
    const storedUser = localStorage.getItem("ambiance_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function login({ email, password }) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Connexion impossible.");
    }

    const { user: realUser, token: realToken } = result.data;

    localStorage.setItem("ambiance_token", realToken);
    localStorage.setItem("ambiance_user", JSON.stringify(realUser));

    setToken(realToken);
    setUser(realUser);

    return realUser;
  }

  async function register({ email, password, name }) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Inscription impossible.");
    }

    const { user: realUser, token: realToken } = result.data;

    localStorage.setItem("ambiance_token", realToken);
    localStorage.setItem("ambiance_user", JSON.stringify(realUser));

    setToken(realToken);
    setUser(realUser);

    return realUser;
  }

  function logout() {
    localStorage.removeItem("ambiance_token");
    localStorage.removeItem("ambiance_user");
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>");
  }
  return context;
}




