import { GoogleGenerativeAI } from "@google/generative-ai";
import AIScan from '../models/AIScan.js';
import dotenv from 'dotenv';

dotenv.config();

export const detectScam = async (req, res) => {
    const { text } = req.body;

    const key = process.env.GEMINI_API_KEY;

    console.log("-----------------------------------------");
    console.log("🚀 [Server AI] Request Received");

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Text input is required' });
    }

    if (!key) {
        return res.status(500).json({ message: 'Gemini API Key missing' });
    }

    try {
        const genAI = new GoogleGenerativeAI(key);

        console.log("🧠 Using model: gemini-1.5-flash-latest");

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest"
        });

        const prompt = `
You are a cybersecurity AI.

Analyze the message and classify it:

SAFE / SUSPICIOUS / SCAM

Return ONLY JSON:
{
  "label": "SCAM",
  "confidence": 90,
  "reason": "short reason"
}

Message: "${text}"
`;

        const result = await model.generateContent(prompt);

        const responseText =
            result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        console.log("👉 RAW RESPONSE:", responseText);

        let aiResult;

        try {
            aiResult = JSON.parse(responseText);
        } catch {
            console.log("⚠️ JSON parse failed");

            aiResult = {
                label: "SUSPICIOUS",
                confidence: 50,
                reason: "AI response parsing failed"
            };
        }

        const newScan = new AIScan({
            text,
            label: aiResult.label,
            confidence: aiResult.confidence,
            reason: aiResult.reason,
        });

        await newScan.save();

        res.status(200).json({
            ...aiResult,
            id: newScan._id
        });

    } catch (error) {
        console.error("🔥 FINAL ERROR:", error.message);

        res.status(200).json({
            label: "SUSPICIOUS",
            confidence: 50,
            reason: "AI temporarily unavailable"
        });
    }
};

export const getRecentScans = async (req, res) => {
    try {
        const scans = await AIScan.find()
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(scans);
    } catch (error) {
        console.error("Error fetching recent scans:", error);
        res.status(500).json({ message: "Failed to fetch scan history" });
    }
};
