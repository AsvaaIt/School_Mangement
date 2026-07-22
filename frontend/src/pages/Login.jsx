import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolCode: localStorage.getItem("asvaa_school_code") || "",
    email: "",
    password: "",
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
        localStorage.setItem("asvaa_school_code", data.data.code);
        localStorage.setItem("asvaa_school_name", data.data.name);
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
    const result = await login(form.schoolCode, form.email, form.password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-canvas">
      <div className="hidden md:flex flex-col justify-between bg-navy-900 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gold-500 flex items-center justify-center font-display font-bold text-navy-900 text-xl">
            A
          </div>
          <div>
            <p className="font-display font-semibold text-lg leading-tight">ASVAA IT</p>
            <p className="text-xs text-white/60">School Management Portal</p>
          </div>
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight max-w-md">
            One portal for admissions, attendance, fees and everything in between.
          </h2>
          <p className="mt-4 text-white/60 max-w-sm">
            Built for administrators, teachers and parents to keep the whole school in sync.
          </p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} ASVAA IT. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-navy-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to access your dashboard.</p>

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
                  {checkingSchool ? "Checking..." : schoolName ? `Signing in to ${schoolName}` : "No school found for this code"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
                placeholder="you@school.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-navy-900 text-white font-medium py-2.5 text-sm hover:bg-navy-800 transition-colors focus-ring disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500 text-center">
            New here? <Link to="/register" className="text-gold-600 font-medium">Create an account</Link>
          </p>
          <p className="mt-2 text-sm text-slate-500 text-center">
            Setting up a new school? <Link to="/create-school" className="text-gold-600 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
