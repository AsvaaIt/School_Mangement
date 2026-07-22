import React from "react";

const StatCard = ({ label, value, accent = "gold", sublabel }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
    <p className={`mt-2 text-3xl font-display font-bold text-navy-900`}>{value}</p>
    {sublabel && <p className="mt-1 text-xs text-slate-400">{sublabel}</p>}
    <div className={`mt-3 h-1 w-10 rounded-full bg-${accent}-500`} />
  </div>
);

export default StatCard;
