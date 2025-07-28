import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  // Place your OpenAI API key here (for production, use process.env.OPENAI_API_KEY)
  const apiKey = "your api key here ";
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  // Log the payload being sent to OpenAI
  console.log("Sending to OpenAI:", {
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0.7,
  });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-1106-preview",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  // Log after fetch is completed
  console.log("Received response from OpenAI");

  const data = await response.json();
  console.log("Raw OpenAI API response:", data);
  return NextResponse.json({ text: data.choices?.[0]?.message?.content ?? "" });
}