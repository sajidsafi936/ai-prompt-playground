import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Keep in sync with MODELS in PromptBox.jsx
const ALLOWED_MODELS = ["gemini-3.8-flash"];

app.post("/api/ask", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
      return res.status(400).json({ error: "Invalid prompt." });
    }

    const chosenModel = ALLOWED_MODELS.includes(model) ? model : ALLOWED_MODELS[0];

    console.time("gemini");
    const interaction = await ai.interactions.create({
      model: chosenModel,
      input: prompt,
    });
    console.timeEnd("gemini");

    res.json({ text: interaction.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));