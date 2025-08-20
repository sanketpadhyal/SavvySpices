const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Safe fetch setup (works on Node 16 and 18+)
let fetchFn;
if (typeof fetch === "function") {
  fetchFn = fetch; // built-in (Node 18+)
} else {
  fetchFn = (...args) =>
    import("node-fetch").then(({ default: f }) => f(...args));
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*", // allow requests from anywhere
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// File where messages are stored
const filePath = path.join(__dirname, "messages.json");

// Test route
app.get("/", (req, res) => {
  res.send("SavvySpices Backend is running. Made by Sanket Padhyal.");
});

// Contact messages route
app.post("/api/messages", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const data = { name, email, message, date: new Date() };

  let messages = [];
  if (fs.existsSync(filePath)) {
    try {
      messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      console.error("Error reading messages.json:", err);
      messages = [];
    }
  }

  messages.push(data);

  try {
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error("Error writing messages.json:", err);
    return res.status(500).json({ error: "Failed to save message." });
  }

  res.status(200).json({
    message: "Message sent successfully! We will get back to you soon.",
  });
});

// SavvySpices AI endpoint
app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await fetchFn(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // If using Replit or a similar IDE, securely store your API key in Secrets or a `.env` file and access it via `process.env.OPENROUTER_API_KEY`.
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are SavvySpices AI, created by Sanket Padhyal. " +
                "Your purpose is to help users with food, cooking, and recipes. " +
                "You are NOT ChatGPT — you are the official SavvySpices AI. " +
                "All guidance comes directly from Sanket Padhyal, a self-taught web developer.",
            },
            { role: "user", content: prompt },
          ],
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || "AI Error" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to connect to AI" });
  }
});

// Admin login and fetch messages
app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (password !== "YOUR_PASS") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let messages = [];
  if (fs.existsSync(filePath)) {
    try {
      messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      console.error("Error reading messages.json:", err);
    }
  }
  res.json({ messages });
});

// Admin delete message
app.post("/admin/delete", (req, res) => {
  const { password, index } = req.body;

  if (password !== "123") { // pass here
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!fs.existsSync(filePath)) {
    return res.json({ messages: [] });
  }

  let messages = [];
  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("Error reading messages.json:", err);
  }

  if (index >= 0 && index < messages.length) {
    messages.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  }

  res.json({ messages });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. Made by Sanket Padhyal.`);
});
