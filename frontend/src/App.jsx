import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateSchool from "./pages/CreateSchool.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import Classes from "./pages/Classes.jsx";
import AttendancePage from "./pages/Attendance.jsx";
import Fees from "./pages/Fees.jsx";
import Notices from "./pages/Notices.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  const hasSchool = Boolean(localStorage.getItem("asvaa_school_code"));
  return <Navigate to={hasSchool ? "/login" : "/create-school"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create-school" element={<CreateSchool />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
      <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
      <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
      <Route path="/fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
      <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
