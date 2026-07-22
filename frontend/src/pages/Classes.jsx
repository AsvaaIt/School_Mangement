import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";

const emptyForm = { name: "", section: "", academicYear: "2026-2027", capacity: 40, classTeacher: "" };

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [classesRes, teachersRes] = await Promise.all([
        api.get("/classes"),
        api.get("/teachers"),
      ]);
      setClasses(classesRes.data.data);
      setTeachers(teachersRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form };
      if (!payload.classTeacher) delete payload.classTeacher;
      await api.post("/classes", payload);
      setShowForm(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add class");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this class?")) return;
    await api.delete(`/classes/${id}`);
    loadData();
  };

  return (
    <Layout title="Classes">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-navy-900 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 focus-ring"
        >
          {showForm ? "Cancel" : "+ Add class"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="grid md:grid-cols-3 gap-4">
            <input required placeholder="Class name (e.g. Grade 8)" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required placeholder="Section (e.g. A)" value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required placeholder="Academic year" value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input type="number" placeholder="Capacity" value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <select value={form.classTeacher} onChange={(e) => setForm({ ...form, classTeacher: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500">
              <option value="">No class teacher assigned</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-gold-500 text-navy-900 font-medium px-5 py-2.5 text-sm hover:bg-gold-400 focus-ring">
            Save class
          </button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-slate-400 text-sm">Loading...</p>}
        {!loading && classes.length === 0 && <p className="text-slate-400 text-sm">No classes yet.</p>}
        {classes.map((c) => (
          <div key={c._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display font-semibold text-navy-900">{c.name} - {c.section}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.academicYear}</p>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                Delete
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-500 space-y-1">
              <p>Class teacher: {c.classTeacher ? `${c.classTeacher.firstName} ${c.classTeacher.lastName}` : "Unassigned"}</p>
              <p>Capacity: {c.capacity} students</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Classes;
