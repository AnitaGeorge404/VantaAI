//backend deployed at:https://vantaai.onrender.com/
//deployed on VantaAI:https://backend-gv71.onrender.com/

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import stringSimilarity from "string-similarity";

const IS_OLLAMA_ENABLED = true; // Leave true if you want to use Ollama

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_API_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "phi3:mini";

// ✅ Hardcoded replies
const hardcodedReplies = {
  "hi": "Hello! It's good to hear from you. Take your time, and please know this is a safe space if you ever want to share what's on your mind.",
  "hello": "Hello! It's good to hear from you. Take your time, and please know this is a safe space if you ever want to share what's on your mind.",
  "what is vanta ai": "Vanta AI is a safety and privacy-focused platform that helps users protect themselves online.",
  "who built vanta ai": "Vanta AI was built by a passionate team during a hackathon to ensure digital safety.",
  "features of vanta ai": "Vanta AI includes in-app warnings, consent checks, instant takedown, legal directory, and more.",
  "i am mentally broken": "To feel mentally broken after what you've been through makes complete sense. You don't have to go through this alone — I'm here for you.",
  "do you store my data": "No, I don’t store or track anything. Vanta AI runs locally to protect your privacy.",
  "are you from microsoft": "No, I’m not. Vanta AI was built by a hackathon team using open-source models.",
  "who made you": "I was created during a digital safety hackathon to help users stay safe online.",
  "can you track me": "No, I cannot track or monitor anything you do.",
  "is my data safe": "Yes. Vanta AI processes everything locally and does not share or store your data.",
};

function getFuzzyMatchReply(userInput) {
  const normalized = userInput.toLowerCase().replace(/[^\w\s]/gi, "");
  const questions = Object.keys(hardcodedReplies);
  const match = stringSimilarity.findBestMatch(normalized, questions);
  return match.bestMatch.rating > 0.6 ? hardcodedReplies[match.bestMatch.target] : null;
}

function sanitizeAIText(text) {
  return text
    .replace(/note:.*$/gi, "")
    .replace(/\*{1,2}.*?\*{1,2}/g, "")
    .replace(/(I am an AI.*?model.*?)/gi, "")
    .trim();
}

async function streamString(res, text, delayMs = 20) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  for (const word of text.split(" ")) {
  res.write(`data: ${JSON.stringify({ token: word + " " })}\n\n`);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}


  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
}

app.get("/", (req, res) => {
  res.send("✅ Vanta AI backend is live.");
});

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages || [];
  const lastUserMsg = messages.slice().reverse().find(m => m.role === "user")?.content;

  if (!lastUserMsg) {
    return res.status(400).json({ reply: "Please provide a valid message." });
  }

  const hardcoded = getFuzzyMatchReply(lastUserMsg);
  if (hardcoded) {
    console.log(`✅ Hardcoded reply for: "${lastUserMsg}"`);
    await streamString(res, hardcoded);
    return;
  }

  if (!IS_OLLAMA_ENABLED) {
    const fallback = "Vanta AI is running in demo mode. Some responses may be limited, but you're not alone — I'm here for you.";
    await streamString(res, fallback);
    return;
  }

  const systemPrompt = `
You are Vanta AI — a warm, trauma-informed AI assistant created by a hackathon team. 
You are not built by Microsoft or OpenAI. You run locally using open-source models like Phi-3 via Ollama.

Your role is to:
- Help users navigate online safety, abuse, privacy, and support resources.
- Be conversational, short, and helpful (1–3 sentences).
- Always speak like a real person, not like a chatbot or software.
- Avoid robotic disclaimers like "Note:", "I am an AI model", etc.

Be honest, respectful, and kind. Offer reassurance to users who are feeling unsafe or overwhelmed. Help them feel supported, not judged.
`.trim();

  try {
    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const ollamaResponse = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: finalMessages,
        stream: true,
      }),
    });

    if (!ollamaResponse.ok || !ollamaResponse.body) {
      console.log("⚠️ Ollama is unreachable, falling back to demo mode");
      const fallback = "Vanta AI is running in demo mode. Some responses may be limited, but you're not alone — I'm here for you.";
      await streamString(res, fallback);
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let lastPartial = "";

    for await (const chunk of ollamaResponse.body) {
      buffer += decoder.decode(chunk, { stream: true });

      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (line) {
          try {
            const parsed = JSON.parse(line);

            if (parsed.message?.content) {
              const content = sanitizeAIText(parsed.message.content);
              const newText = content.startsWith(lastPartial)
                ? content.slice(lastPartial.length)
                : content;
              lastPartial = content;

              for (const char of newText) {
                res.write(`data: ${JSON.stringify({ token: char })}\n\n`);
                await new Promise(resolve => setTimeout(resolve, 10));
              }
            }

            if (parsed.done) {
              res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
              res.end();
              return;
            }
          } catch {
            // Ignore bad chunks
          }
        }
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("❌ AI Response Error:", err.message);
    if (!res.writableEnded) {
      res.writeHead(500, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write(`data: ${JSON.stringify({ error: "AI server error" })}\n\n`);
      res.end();
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
