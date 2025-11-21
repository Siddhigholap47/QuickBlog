// src/components/admin/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/admin/sidebar";
import { useAppContext } from "../../../context/AppContext";

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext();

  const Logout = () => {
    try {
      // 1) clear via context helper (this must update localStorage + state + axios)
      setToken(null);

      // 2) additional safety: ensure axios instance header cleared
      if (axios?.defaults?.headers?.common) {
        delete axios.defaults.headers.common["Authorization"];
      }

      // 3) navigate to public homepage (replace so no history back to admin)
      navigate("/", { replace: true });

      // 4) fallback: in case a route-guard immediately redirects, force a hard reload to '/'
      //    small timeout gives React a moment to rerender before forcing reload.
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 200);
    } catch (err) {
      console.error("Logout error:", err);
      // ensure we still navigate away
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-28 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <button
          className="bg-primary text-white rounded px-4 py-2"
          onClick={Logout}
        >
          Logout
        </button>
      </div>

      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
