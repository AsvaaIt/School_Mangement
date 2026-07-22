import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, notices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, classes, notices] = await Promise.all([
          api.get("/students"),
          api.get("/teachers"),
          api.get("/classes"),
          api.get("/notices"),
        ]);
        setStats({
          students: students.data.count,
          teachers: teachers.data.count,
          classes: classes.data.count,
          notices: notices.data.data.slice(0, 5),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout title="Dashboard">
      <p className="text-sm text-slate-500 mb-6">
        Welcome back, <span className="font-medium text-navy-900">{user?.name}</span>. Here's what's happening at school today.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students" value={loading ? "…" : stats.students} accent="gold" sublabel="Total enrolled" />
        <StatCard label="Teachers" value={loading ? "…" : stats.teachers} accent="gold" sublabel="Active staff" />
        <StatCard label="Classes" value={loading ? "…" : stats.classes} accent="gold" sublabel="This academic year" />
        <StatCard label="Notices" value={loading ? "…" : stats.notices.length} accent="gold" sublabel="Recent posts" />
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display font-semibold text-navy-900">Recent notices</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && <p className="px-5 py-6 text-sm text-slate-400">Loading...</p>}
          {!loading && stats.notices.length === 0 && (
            <p className="px-5 py-6 text-sm text-slate-400">No notices posted yet.</p>
          )}
          {stats.notices.map((n) => (
            <div key={n._id} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-navy-900 text-sm">{n.title}</p>
                {n.pinned && (
                  <span className="text-xs bg-gold-500/10 text-gold-600 px-2 py-0.5 rounded-full font-medium">
                    Pinned
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{n.content}</p>
              <p className="text-xs text-slate-400 mt-2">
                {n.postedBy?.name} · {new Date(n.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
