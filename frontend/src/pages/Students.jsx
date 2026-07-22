import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";

const emptyForm = {
  admissionNumber: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "male",
  rollNumber: "",
  guardianName: "",
  guardianPhone: "",
  classRoom: "",
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get("/students", { params: search ? { search } : {} }),
        api.get("/classes"),
      ]);
      setStudents(studentsRes.data.data);
      setClasses(classesRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/students", form);
      setShowForm(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this student record?")) return;
    await api.delete(`/students/${id}`);
    loadData();
  };

  return (
    <Layout title="Students">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or admission no."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-64 focus-ring focus:border-gold-500"
          />
          <button className="rounded-lg bg-slate-100 text-navy-900 px-4 py-2 text-sm font-medium hover:bg-slate-200">
            Search
          </button>
        </form>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-navy-900 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 focus-ring"
        >
          {showForm ? "Cancel" : "+ Add student"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="grid md:grid-cols-3 gap-4">
            <input required placeholder="Admission number" value={form.admissionNumber}
              onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required placeholder="First name" value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required placeholder="Last name" value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input type="date" placeholder="Date of birth" value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select value={form.classRoom} onChange={(e) => setForm({ ...form, classRoom: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500">
              <option value="">No class assigned</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
              ))}
            </select>
            <input placeholder="Roll number" value={form.rollNumber}
              onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input placeholder="Guardian name" value={form.guardianName}
              onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input placeholder="Guardian phone" value={form.guardianPhone}
              onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-gold-500 text-navy-900 font-medium px-5 py-2.5 text-sm hover:bg-gold-400 focus-ring">
            Save student
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-200">
              <th className="px-5 py-3">Admission no.</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Class</th>
              <th className="px-5 py-3">Guardian</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-slate-400">Loading...</td></tr>
            )}
            {!loading && students.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-slate-400">No students found.</td></tr>
            )}
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-navy-900">{s.admissionNumber}</td>
                <td className="px-5 py-3">{s.firstName} {s.lastName}</td>
                <td className="px-5 py-3 text-slate-500">
                  {s.classRoom ? `${s.classRoom.name} - ${s.classRoom.section}` : "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">{s.guardianName || "—"}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 capitalize">
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Students;
