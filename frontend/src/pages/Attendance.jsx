import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statusMap, setStatusMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/classes").then((res) => setClasses(res.data.data));
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    api.get("/students", { params: { classRoom: selectedClass } }).then((res) => {
      setStudents(res.data.data);
      const initial = {};
      res.data.data.forEach((s) => (initial[s._id] = "present"));
      setStatusMap(initial);
    });
  }, [selectedClass]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const records = students.map((s) => ({
        student: s._id,
        classRoom: selectedClass,
        date,
        status: statusMap[s._id] || "present",
      }));
      await api.post("/attendance", { records });
      setMessage("Attendance saved successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const statusColors = {
    present: "bg-green-50 text-green-700 border-green-200",
    absent: "bg-red-50 text-red-700 border-red-200",
    late: "bg-amber-50 text-amber-700 border-amber-200",
    excused: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <Layout title="Attendance">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500 min-w-[200px]">
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500" />
          </div>
          {students.length > 0 && (
            <button onClick={handleSave} disabled={saving}
              className="rounded-lg bg-navy-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-800 focus-ring disabled:opacity-60">
              {saving ? "Saving..." : "Save attendance"}
            </button>
          )}
        </div>
        {message && <p className="mt-3 text-sm text-navy-900">{message}</p>}
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-200">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Roll no.</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s._id}>
                  <td className="px-5 py-3 font-medium text-navy-900">{s.firstName} {s.lastName}</td>
                  <td className="px-5 py-3 text-slate-500">{s.rollNumber || "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {["present", "absent", "late", "excused"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusMap({ ...statusMap, [s._id]: status })}
                          className={`text-xs px-2.5 py-1 rounded-full border capitalize font-medium transition-colors ${
                            statusMap[s._id] === status
                              ? statusColors[status]
                              : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedClass && (
        <p className="text-sm text-slate-400">Select a class to mark today's attendance.</p>
      )}
    </Layout>
  );
};

export default AttendancePage;
