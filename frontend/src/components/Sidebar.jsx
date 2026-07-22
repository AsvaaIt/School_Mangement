import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/students", label: "Students", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12.083 12.083 0 0121 17.5C21 20 12 22 12 22s-9-2-9-4.5c0-1.83.63-3.53 1.84-4.92L12 14z" },
  { to: "/teachers", label: "Teachers", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-4.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4" },
  { to: "/classes", label: "Classes", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" },
  { to: "/attendance", label: "Attendance", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { to: "/fees", label: "Fees", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1" },
  { to: "/notices", label: "Notices", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
];

const Sidebar = () => {
  const { user } = useAuth();
  const schoolName = user?.school?.name || localStorage.getItem("asvaa_school_name") || "School Portal";

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-navy-900 text-white min-h-screen">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center font-display font-bold text-navy-900 text-lg">
            A
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold leading-tight truncate">{schoolName}</p>
            <p className="text-xs text-white/60 leading-tight">ASVAA IT Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-ring ${
                isActive
                  ? "bg-white/10 text-gold-400"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/50">
        Signed in as <span className="text-white/80">{user?.role}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
