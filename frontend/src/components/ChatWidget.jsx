import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

// Floating chat assistant, present across the whole app.
// - Logged out: talks to /api/chat/public (school-code-scoped FAQ helper,
//   no access to student/staff data).
// - Logged in: talks to /api/chat/staff (can call tools to look up this
//   school's live students, attendance, fees, and notices).
const ChatWidget = () => {
  const { user } = useAuth();
  const schoolCode = user?.school?.code || localStorage.getItem("asvaa_school_code") || "";
  const schoolName = user?.school?.name || localStorage.getItem("asvaa_school_name") || "your school";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  const isStaffMode = Boolean(user);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: isStaffMode
            ? `Hi ${user.name.split(" ")[0]}, I can look up students, attendance, fees, or recent notices for ${schoolName}. What do you need?`
            : `Hi! I can answer general questions about ${schoolName} and how this portal works. What would you like to know?`,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!schoolCode) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const endpoint = isStaffMode ? "/chat/staff" : "/chat/public";
      const payload = isStaffMode ? { message: trimmed, history } : { schoolCode, message: trimmed, history };
      const { data } = await api.post(endpoint, payload);
      setMessages([...nextMessages, { role: "assistant", content: data.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "The assistant is unavailable right now. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="mb-3 w-[340px] max-w-[calc(100vw-2.5rem)] h-[460px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-navy-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center text-navy-900 font-display font-bold text-sm shrink-0">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-display font-semibold leading-tight truncate">ASVAA Assistant</p>
                <p className="text-[11px] text-white/60 leading-tight">
                  {isStaffMode ? "Staff mode · live data" : "General help"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white text-lg leading-none px-1"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-canvas">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-navy-900 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl rounded-bl-sm px-3 py-2 text-sm text-slate-400">
                  Thinking...
                </div>
              </div>
            )}
            {error && <p className="text-xs text-red-500 px-1">{error}</p>}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-200 p-2 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isStaffMode ? "Ask about a student, fees, attendance..." : "Ask a question..."}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus-ring focus:border-gold-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-gold-500 text-navy-900 px-3 py-2 text-sm font-medium hover:bg-gold-400 focus-ring disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-navy-900 text-gold-400 shadow-xl flex items-center justify-center hover:bg-navy-800 focus-ring transition-colors"
        aria-label="Toggle chat assistant"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.216 0-2.373-.214-3.428-.6L3 21l1.65-4.13C3.61 15.55 3 13.84 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
