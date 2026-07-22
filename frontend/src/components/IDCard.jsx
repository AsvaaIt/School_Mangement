import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

// Renders a single CR80-proportioned ID card (front side) for either a
// student or a teacher. `type` is "student" | "teacher".
const IDCard = ({ type, person, schoolName, schoolCode }) => {
  const [qrDataUrl, setQrDataUrl] = useState("");

  const fullName = `${person.firstName} ${person.lastName}`;
  const idNumber = type === "student" ? person.admissionNumber : person.employeeId;
  const roleLine =
    type === "student"
      ? person.classRoom
        ? `${person.classRoom.name} - ${person.classRoom.section}`
        : "Class not assigned"
      : (person.subjectSpecialization || []).join(", ") || "Teacher";

  useEffect(() => {
    const payload = JSON.stringify({
      school: schoolCode,
      type,
      id: idNumber,
      name: fullName,
    });
    QRCode.toDataURL(payload, { margin: 1, width: 200, color: { dark: "#1B2A4A", light: "#FFFFFF" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [schoolCode, type, idNumber, fullName]);

  const accentLabel = type === "student" ? "STUDENT ID" : "STAFF ID";
  const initials = `${person.firstName?.[0] || ""}${person.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200"
      style={{ width: "340px", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-navy-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-gold-500 flex items-center justify-center text-navy-900 font-display font-bold text-sm shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-display font-semibold leading-tight truncate">{schoolName}</p>
            <p className="text-[10px] text-white/60 leading-tight">ASVAA IT Portal</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold tracking-wide bg-gold-500 text-navy-900 rounded px-2 py-0.5 shrink-0">
          {accentLabel}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-4 flex gap-4">
        <div className="shrink-0 w-16 h-16 rounded-full bg-navy-900/5 border-2 border-navy-900/10 flex items-center justify-center">
          <span className="font-display font-bold text-xl text-navy-900">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-navy-900 text-base leading-tight truncate">{fullName}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{roleLine}</p>
          <p className="text-[11px] text-slate-400 mt-2 uppercase tracking-wide">ID Number</p>
          <p className="font-mono text-sm font-semibold text-navy-900">{idNumber}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-end justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-[10px] text-slate-400">Valid for academic year</p>
          <p className="text-xs font-medium text-navy-900">2026-2027</p>
          <div className="mt-3 w-20 border-t border-slate-300 pt-1">
            <p className="text-[9px] text-slate-400">Authorized signature</p>
          </div>
        </div>
        {qrDataUrl && <img src={qrDataUrl} alt="QR code" className="w-16 h-16" />}
      </div>
    </div>
  );
};

export default IDCard;
