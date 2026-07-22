import React from "react";
import IDCard from "./IDCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Full-screen overlay showing a printable ID card. Everything outside
// #id-card-printable is hidden via the @media print rules in index.css,
// so hitting "Print" only outputs the card itself.
const IDCardModal = ({ type, person, onClose }) => {
  const { user } = useAuth();
  const schoolName = user?.school?.name || localStorage.getItem("asvaa_school_name") || "School";
  const schoolCode = user?.school?.code || localStorage.getItem("asvaa_school_code") || "";

  if (!person) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm no-print">
      <div className="bg-canvas rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl">
        <div id="id-card-printable">
          <IDCard type={type} person={person} schoolName={schoolName} schoolCode={schoolCode} />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-navy-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-800 focus-ring flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
            </svg>
            Print ID card
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-white border border-slate-300 text-navy-900 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 focus-ring"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IDCardModal;
