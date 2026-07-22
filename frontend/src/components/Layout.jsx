import React from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ title, children }) => {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title={title} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
