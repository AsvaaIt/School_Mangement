import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";

const emptyForm = { student: "", academicYear: "2026-2027", term: "Term 1", amountDue: "", dueDate: "" };

const statusStyles = {
  paid: "bg-green-50 text-green-700",
  partial: "bg-amber-50 text-amber-700",
  pending: "bg-slate-100 text-slate-600",
  overdue: "bg-red-50 text-red-700",
};

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payAmount, setPayAmount] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [feesRes, studentsRes] = await Promise.all([api.get("/fees"), api.get("/students")]);
      setFees(feesRes.data.data);
      setStudents(studentsRes.data.data);
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
      await api.post("/fees", { ...form, amountDue: Number(form.amountDue) });
      setShowForm(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create fee record");
    }
  };

  const handlePay = async (id) => {
    const amount = Number(payAmount[id]);
    if (!amount || amount <= 0) return;
    await api.post(`/fees/${id}/pay`, { amount, method: "cash" });
    setPayAmount({ ...payAmount, [id]: "" });
    loadData();
  };

  return (
    <Layout title="Fees">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-navy-900 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 focus-ring"
        >
          {showForm ? "Cancel" : "+ New fee record"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="grid md:grid-cols-3 gap-4">
            <select required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500">
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
              ))}
            </select>
            <input required placeholder="Term (e.g. Term 1)" value={form.term}
              onChange={(e) => setForm({ ...form, term: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required placeholder="Academic year" value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input required type="number" placeholder="Amount due" value={form.amountDue}
              onChange={(e) => setForm({ ...form, amountDue: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <input type="date" placeholder="Due date" value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-gold-500 text-navy-900 font-medium px-5 py-2.5 text-sm hover:bg-gold-400 focus-ring">
            Create record
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-200">
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Term</th>
              <th className="px-5 py-3">Due</th>
              <th className="px-5 py-3">Paid</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Record payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-slate-400">Loading...</td></tr>
            )}
            {!loading && fees.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-slate-400">No fee records found.</td></tr>
            )}
            {fees.map((f) => (
              <tr key={f._id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-navy-900">
                  {f.student?.firstName} {f.student?.lastName}
                </td>
                <td className="px-5 py-3 text-slate-500">{f.term} · {f.academicYear}</td>
                <td className="px-5 py-3">₹{f.amountDue.toLocaleString()}</td>
                <td className="px-5 py-3">₹{f.amountPaid.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${statusStyles[f.status]}`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {f.status !== "paid" && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={payAmount[f._id] || ""}
                        onChange={(e) => setPayAmount({ ...payAmount, [f._id]: e.target.value })}
                        className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus-ring focus:border-gold-500"
                      />
                      <button
                        onClick={() => handlePay(f._id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800"
                      >
                        Pay
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Fees;
