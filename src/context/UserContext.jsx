import { createContext, useContext, useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000/api";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt_token") || null);
  const [email, setEmail] = useState(
    localStorage.getItem("user_email") || null
  );

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthSuccess = (newToken, userEmail) => {
    setToken(newToken);
    setEmail(userEmail);
    localStorage.setItem("jwt_token", newToken);
    localStorage.setItem("user_email", userEmail);
    setError(null);
  };
  const login = async (userEmail, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
      });
      const data = await response.json();

      if (response.ok && data.token && data.email) {
        handleAuthSuccess(data.token, data.email);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Credenciales inválidas.",
        };
      }
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, error: "Error de conexión con el servidor." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userEmail, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
      });
      const data = await response.json();

      if (response.ok && data.token && data.email) {
        handleAuthSuccess(data.token, data.email);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Error al registrar el usuario.",
        };
      }
    } catch (err) {
      console.error("Register Error:", err);
      return { success: false, error: "Error de conexión con el servidor." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    setProfileData(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_email");
  };

  const getProfile = async () => {
    if (!token) return { success: false, error: "No autenticado." };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setProfileData(data);
        return { success: true, data };
      } else if (response.status === 401) {
        logout();
        return {
          success: false,
          error: "Sesión expirada. Inicia sesión de nuevo.",
        };
      } else {
        return {
          success: false,
          error: data.message || "Error al obtener perfil.",
        };
      }
    } catch (err) {
      console.error("Get Profile Error:", err);
      return { success: false, error: "Error de conexión al obtener perfil." };
    }
  };

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  const contextValue = {
    token,
    email,
    profileData,
    isLoading,
    error,
    isLoggedIn: !!token,
    login,
    register,
    logout,
    getProfile,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext debe usarse dentro de un UserProvider");
  }
  return context;
};

export default UserProvider;
