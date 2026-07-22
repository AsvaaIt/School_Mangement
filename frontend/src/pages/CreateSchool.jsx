import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

const CreateSchool = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", contactEmail: "", contactPhone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/schools", form);
      setCreated(data.data);
      localStorage.setItem("asvaa_school_code", data.data.code);
      localStorage.setItem("asvaa_school_name", data.data.name);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the school. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-navy-900">{created.name} is set up</h1>
          <p className="mt-2 text-sm text-slate-500">
            A dedicated database has been created for your school. Save this school code — you and your
            staff will need it every time you sign in.
          </p>
          <div className="mt-5 rounded-lg bg-navy-900 text-gold-400 font-mono text-lg font-semibold py-3 tracking-wide">
            {created.code}
          </div>
          <button
            onClick={() => navigate("/register")}
            className="mt-6 w-full rounded-lg bg-gold-500 text-navy-900 font-medium py-2.5 text-sm hover:bg-gold-400 focus-ring"
          >
            Continue to create your admin account
          </button>
        </div>
      </div>
    );
  }

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
            Every school gets its own private space, from day one.
          </h2>
          <p className="mt-4 text-white/60 max-w-sm">
            Setting up your school creates a dedicated, isolated database — your students, staff and
            records never mix with anyone else's.
          </p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} ASVAA IT. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-navy-900">Set up your school</h1>
          <p className="mt-1 text-sm text-slate-500">
            Start by naming your school. We'll create a dedicated database for it automatically.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">School name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
                placeholder="Greenwood High School"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Address <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Contact email <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Contact phone <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus-ring focus:border-gold-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-navy-900 text-white font-medium py-2.5 text-sm hover:bg-navy-800 transition-colors focus-ring disabled:opacity-60"
            >
              {loading ? "Setting up..." : "Create school"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500 text-center">
            Already have a school code? <Link to="/login" className="text-gold-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateSchool;
