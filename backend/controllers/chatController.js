import asyncHandler from "express-async-handler";
import { callSambaNova } from "../utils/sambanovaClient.js";
import { chatToolDefinitions, buildChatToolImplementations } from "../utils/chatTools.js";

const MAX_TOOL_ROUNDS = 4;
const MAX_HISTORY_MESSAGES = 12;

const sanitizeHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
};

// @desc  Public FAQ chat — no login required. Only knows publicly-shareable
//        school info; has no access to student/attendance/fee data.
// @route POST /api/chat/public   Body: { message, history }
export const publicChat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message || !message.trim()) {
    res.status(400);
    throw new Error("A message is required");
  }

  const school = req.school;
  const systemPrompt = `You are the friendly AI assistant for ${school.name}, a school that uses the ASVAA IT School Management Portal.
You are speaking with a prospective parent, student, or visitor who is NOT logged in.
You can discuss: general admissions questions, how the school management portal works (registration requires a school code, staff/parents log in to see dashboards, attendance, fees, notices), and the school's publicly listed contact details below.
You do NOT have access to any student records, attendance, grades, or fee data, and must never invent such information. If asked for private data, politely explain that you can't access that and suggest logging into the portal or contacting the school office directly.
Keep answers concise (2-4 sentences unless more detail is clearly needed) and friendly.

School contact details:
- Name: ${school.name}
- Address: ${school.address || "Not listed"}
- Contact email: ${school.contactEmail || "Not listed"}
- Contact phone: ${school.contactPhone || "Not listed"}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...sanitizeHistory(history),
    { role: "user", content: message.trim() },
  ];

  const choice = await callSambaNova({ messages });

  res.json({ success: true, data: { reply: choice.message.content } });
});

// @desc  Internal assistant for logged-in staff — can call tools to query
//        this school's own live data (students, attendance, fees, notices).
// @route POST /api/chat/staff   Body: { message, history }
export const staffChat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message || !message.trim()) {
    res.status(400);
    throw new Error("A message is required");
  }

  const school = req.school;
  const user = req.user;
  const toolImplementations = buildChatToolImplementations(req.tenantModels);

  const systemPrompt = `You are the AI assistant embedded in the ASVAA IT School Management Portal for ${school.name}.
You are speaking with ${user.name}, a logged-in ${user.role} at this school.
Use the provided tools to look up live data (students, attendance, fees, dashboard stats, notices) rather than guessing or inventing information. Only call a tool when you actually need that data to answer.
If a tool returns an error or no result, say so plainly rather than making something up.
Keep answers concise and format lists clearly using short bullet points when helpful.`;

  let messages = [
    { role: "system", content: systemPrompt },
    ...sanitizeHistory(history),
    { role: "user", content: message.trim() },
  ];

  let finalContent = null;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const choice = await callSambaNova({ messages, tools: chatToolDefinitions });
    const { message: modelMessage } = choice;

    if (!modelMessage.tool_calls || modelMessage.tool_calls.length === 0) {
      finalContent = modelMessage.content;
      break;
    }

    messages.push(modelMessage);

    for (const call of modelMessage.tool_calls) {
      const impl = toolImplementations[call.function.name];
      let result;
      try {
        const args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
        result = impl ? await impl(args) : { error: `Unknown tool: ${call.function.name}` };
      } catch (err) {
        result = { error: err.message };
      }
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }

  if (finalContent === null) {
    finalContent =
      "I wasn't able to finish looking that up — try asking a more specific question (e.g. include an admission number).";
  }

  res.json({ success: true, data: { reply: finalContent } });
});
