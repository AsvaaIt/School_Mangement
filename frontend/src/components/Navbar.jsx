import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
      <h1 className="font-display font-semibold text-xl text-navy-900">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-navy-900">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="text-sm font-medium text-slate-500 hover:text-navy-900 focus-ring rounded px-2 py-1"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
