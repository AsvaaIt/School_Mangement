// Thin wrapper around SambaNova Cloud's OpenAI-compatible chat completions
// endpoint. No SDK dependency needed — Node 18+ has global fetch.
const SAMBANOVA_BASE_URL = "https://api.sambanova.ai/v1";

export const callSambaNova = async ({ messages, tools }) => {
  const apiKey = process.env.SAMBANOVA_API_KEY;
  if (!apiKey) {
    throw new Error("SAMBANOVA_API_KEY is not set in the backend .env file");
  }

  const model = process.env.SAMBANOVA_MODEL || "Meta-Llama-3.3-70B-Instruct";

  const body = {
    model,
    messages,
    temperature: 0.3,
    max_tokens: 700,
  };
  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const response = await fetch(`${SAMBANOVA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`SambaNova API error (${response.status}): ${errorText || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0];
};
