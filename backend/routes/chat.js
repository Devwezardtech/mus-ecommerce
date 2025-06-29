/*const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;
    const model = "models/gemini-1.5-flash"; // ✅ Use a valid model name

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${API_KEY}`;

    const response = await axios.post(apiUrl, {
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error?.response?.data || error.message);
    res.status(500).json({ reply: "Gemini AI failed to respond." });
  }
});

module.exports = router;
*/