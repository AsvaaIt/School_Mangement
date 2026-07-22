import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyForm = { title: "", content: "", audience: "all", pinned: false };

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canPost = user?.role === "admin" || user?.role === "teacher";

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notices");
      setNotices(res.data.data);
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
      await api.post("/notices", form);
      setShowForm(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post notice");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;
    await api.delete(`/notices/${id}`);
    loadData();
  };

  return (
    <Layout title="Notices">
      {canPost && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-navy-900 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 focus-ring"
          >
            {showForm ? "Cancel" : "+ Post notice"}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="space-y-4">
            <input required placeholder="Title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <textarea required placeholder="Content" rows={4} value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
            <div className="flex items-center gap-4">
              <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500">
                <option value="all">Everyone</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.pinned}
                  onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
                Pin to top
              </label>
            </div>
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-gold-500 text-navy-900 font-medium px-5 py-2.5 text-sm hover:bg-gold-400 focus-ring">
            Post notice
          </button>
        </form>
      )}

      <div className="space-y-4">
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {!loading && notices.length === 0 && <p className="text-sm text-slate-400">No notices posted yet.</p>}
        {notices.map((n) => (
          <div key={n._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-navy-900">{n.title}</h3>
                  {n.pinned && (
                    <span className="text-xs bg-gold-500/10 text-gold-600 px-2 py-0.5 rounded-full font-medium">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  For {n.audience} · {n.postedBy?.name} · {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
              {canPost && (
                <button onClick={() => handleDelete(n._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                  Delete
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{n.content}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Notices;
