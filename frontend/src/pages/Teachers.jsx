import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import IDCardModal from "../components/IDCardModal.jsx";
import api from "../api/axios.js";

const emptyForm = {
  employeeId: "",
  firstName: "",
  lastName: "",
  qualification: "",
  phone: "",
  subjectSpecialization: "",
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idCardTeacher, setIdCardTeacher] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data.data);
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
      const { data } = await api.post("/teachers", {
        ...form,
        subjectSpecialization: form.subjectSpecialization
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setShowForm(false);
      setForm(emptyForm);
      loadData();
      setIdCardTeacher(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add teacher");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this teacher record?")) return;
    await api.delete(`/teachers/${id}`);
    loadData();
  };

  return (
    <Layout title="Teachers">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-navy-900 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 focus-ring"
        >
          {showForm ? "Cancel" : "+ Add teacher"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="grid md:grid-cols-3 gap-4">
            <input required placeholder="Employee ID" value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required placeholder="First name" value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required placeholder="Last name" value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input placeholder="Qualification" value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input placeholder="Subjects (comma separated)" value={form.subjectSpecialization}
              onChange={(e) => setForm({ ...form, subjectSpecialization: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-gold-500 text-navy-900 font-medium px-5 py-2.5 text-sm hover:bg-gold-400 focus-ring">
            Save teacher
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-200">
              <th className="px-5 py-3">Employee ID</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Subjects</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">Loading...</td></tr>
            )}
            {!loading && teachers.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">No teachers found.</td></tr>
            )}
            {teachers.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-navy-900">{t.employeeId}</td>
                <td className="px-5 py-3">{t.firstName} {t.lastName}</td>
                <td className="px-5 py-3 text-slate-500">{t.subjectSpecialization?.join(", ") || "—"}</td>
                <td className="px-5 py-3 text-slate-500">{t.phone || "—"}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => setIdCardTeacher(t)}
                    className="text-navy-900 hover:text-gold-600 text-xs font-medium mr-3"
                  >
                    ID card
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {idCardTeacher && (
        <IDCardModal type="teacher" person={idCardTeacher} onClose={() => setIdCardTeacher(null)} />
      )}
    </Layout>
  );
};

export default Teachers;
