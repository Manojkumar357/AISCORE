const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON requests

let leads = []; // In-memory storage

// Simple AI: Keyword-based scoring
const scoreLead = (message) => {
  const positiveKeywords = ["interested", "love", "great", "need", "want"];
  const negativeKeywords = ["not", "hate", "bad", "no"];
  const words = message.toLowerCase().split(" ");
  
  let score = 0.5; // Neutral base score
  positiveKeywords.forEach((keyword) => {
    if (words.includes(keyword)) score += 0.2;
  });
  negativeKeywords.forEach((keyword) => {
    if (words.includes(keyword)) score -= 0.2;
  });
  return Math.max(0, Math.min(1, score)).toFixed(2); // Clamp between 0 and 1
};

app.post("/add-lead", (req, res) => {
  const { name, email, message } = req.body;
  const score = scoreLead(message);
  const lead = { name, email, message, score };
  leads.push(lead);
  res.json({ message: "Lead added", lead });
});

app.get("/leads", (req, res) => {
  res.json(leads);
});
app.delete("/delete-lead/:email", (req, res) => {
  const { email } = req.params;
  leads = leads.filter((lead) => lead.email !== email);
  res.json({ message: "Lead deleted successfully" });
});

// Endpoint to reset all leads
app.delete("/reset-leads", (req, res) => {
  leads = [];
  res.json({ message: "All leads have been reset" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

