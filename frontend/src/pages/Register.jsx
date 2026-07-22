import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolCode: localStorage.getItem("asvaa_school_code") || "",
    name: "",
    email: "",
    password: "",
    role: "admin",
    phone: "",
  });
  const [error, setError] = useState("");
  const [schoolName, setSchoolName] = useState(localStorage.getItem("asvaa_school_name") || "");
  const [checkingSchool, setCheckingSchool] = useState(false);

  useEffect(() => {
    const code = form.schoolCode.trim();
    if (!code) {
      setSchoolName("");
      return;
    }
    const timeout = setTimeout(async () => {
      setCheckingSchool(true);
      try {
        const { data } = await api.get(`/schools/lookup/${code}`);
        setSchoolName(data.data.name);
      } catch {
        setSchoolName("");
      } finally {
        setCheckingSchool(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [form.schoolCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(form);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h1 className="font-display text-2xl font-bold text-navy-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Set up a staff or admin account for your school.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">School code</label>
            <input
              required
              value={form.schoolCode}
              onChange={(e) => setForm({ ...form, schoolCode: e.target.value.toUpperCase() })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-mono focus-ring focus:border-gold-500"
              placeholder="GREENWOOD-4821"
            />
            {form.schoolCode && (
              <p className="mt-1 text-xs text-slate-400">
                {checkingSchool ? "Checking..." : schoolName ? `Registering at ${schoolName}` : "No school found for this code"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-navy-900 text-white font-medium py-2.5 text-sm hover:bg-navy-800 transition-colors focus-ring disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 text-center">
          Already have an account? <Link to="/login" className="text-gold-600 font-medium">Sign in</Link>
        </p>
        <p className="mt-2 text-sm text-slate-500 text-center">
          Setting up a new school? <Link to="/create-school" className="text-gold-600 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
