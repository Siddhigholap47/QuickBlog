// src/pages/admin/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { axios, setToken } = useAppContext(); // uses context axios + setToken

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/admin/login", { email, password });

      if (data?.success && data?.token) {
        // <<-- This line is critical: sets token in context + axios headers
        setToken(data.token);

        toast.success("Logged in successfully");
        // navigate to admin list (update route if different)
        navigate("/admin/listblog");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (err) {
      console.error("[Login] ERROR:", err);
      toast.error(err?.response?.data?.message || err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="admin@example.com"
            className="border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded px-4 py-2 mt-2 hover:bg-primary"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
