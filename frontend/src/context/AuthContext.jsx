import { createContext, useContext, useReducer, useEffect } from "react";
import authAPI from "../api/auth";

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };

    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "AUTH_FAIL":
      return { ...state, isLoading: false, error: action.payload };

    case "LOGOUT":
      return { user: null, token: null, isLoading: false, error: null };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [state.token, state.user]);

  const register = async (formData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const data = await authAPI.register(formData);
      dispatch({ type: "AUTH_SUCCESS", payload: data.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      dispatch({ type: "AUTH_FAIL", payload: message });
      return { success: false, message };
    }
  };

  const login = async (formData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const data = await authAPI.login(formData);
      dispatch({ type: "AUTH_SUCCESS", payload: data.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_FAIL", payload: message });
      return { success: false, message };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};