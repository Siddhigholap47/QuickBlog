// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";

// create a dedicated axios instance for the app
const api = axios.create({
  baseURL: API_BASE,
});

// TEMP debug handle (remove after you confirm token is applied)
if (typeof window !== "undefined") window.__APP_API__ = api;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setTokenState] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  // helper to set/remove token everywhere (use this after login/logout)
  // inside AppContext.jsx
const setToken = (tok) => {
  if (tok) {
    localStorage.setItem("token", tok);
    setTokenState(tok);
    api.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
  } else {
    // IMPORTANT: remove from localStorage, axios and state
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setTokenState(null);
  }
};


  // fetch blogs (uses the api instance)
  const fetchBlogs = async () => {
    try {
      const { data } = await api.get("/api/blog/all");
      if (data?.success) {
        setBlogs(data.blogs || []);
      } else {
        toast.error(data?.message || "Could not fetch blogs");
      }
    } catch (error) {
      console.error("[fetchBlogs] ERROR:", error);
      toast.error(error?.response?.data?.message || error.message || "Network error");
    }
  };
  

  useEffect(() => {
    // initialize token and axios header (if token present)
    const localTok = localStorage.getItem("token");
    if (localTok) {
      setTokenState(localTok);
      api.defaults.headers.common["Authorization"] = `Bearer ${localTok}`;
    }
    // fetch blogs once on mount
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    token,
    axios: api,      // expose configured axios instance as `axios`
    setToken,        // important: use this after login to update headers
    blogs,
    setBlogs,
    input,
    setInput,
    navigate,
    fetchBlogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
