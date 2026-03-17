import { GoogleGenerativeAI } from "@google/generative-ai";
import AIScan from '../models/AIScan.js';
import dotenv from 'dotenv';

dotenv.config();

export const detectScam = async (req, res) => {
    try {
        const { text } = req.body;
        const key = process.env.GEMINI_API_KEY;

        console.log("🔍 AI Analysis requested for text length:", text?.length);

        if (!text || typeof text !== 'string' || text.trim().length < 5) {
            return res.status(400).json({ message: 'Please provide at least 5 characters to analyze.' });
        }

        if (!key) {
            console.error("❌ GEMINI_API_KEY is missing!");
            return res.status(500).json({ message: 'AI API Key missing. Please check backend .env file.' });
        }

        const genAI = new GoogleGenerativeAI(key);
        // Switching to gemini-pro for maximum compatibility
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Act as a cybersecurity expert. Analyze the following message and determine if it is a SCAM, SUSPICIOUS, or SAFE.
            
            Return ONLY a valid JSON object with this exact structure:
            {"label": "SAFE"|"SUSPICIOUS"|"SCAM", "confidence": number, "reason": "one sentence explanation"}
            
            Message to analyze: "${text.substring(0, 2000)}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text();

        console.log("🤖 AI Raw Response:", responseText);

        // Sanitize: remove any markdown backticks if AI included them
        responseText = responseText.replace(/```json|```/g, "").trim();

        let aiResult;
        try {
            aiResult = JSON.parse(responseText);
        } catch (e) {
            console.warn("⚠️ AI JSON Parse Failed. Attempting recovery...");
            const labelMatch = responseText.match(/SCAM|SUSPICIOUS|SAFE/i);
            const label = labelMatch ? labelMatch[0].toUpperCase() : "SUSPICIOUS";
            aiResult = { 
                label, 
                confidence: 50, 
                reason: "Analysis completed but format was slightly off." 
            };
        }

        const newScan = await AIScan.create({
            text: text.substring(0, 500),
            label: aiResult.label,
            confidence: aiResult.confidence,
            reason: aiResult.reason,
        });

        res.status(200).json({
            label: aiResult.label,
            confidence: aiResult.confidence,
            reason: aiResult.reason,
            id: newScan._id
        });

    } catch (error) {
        console.error("❌ AI ERROR DETAILS:", error);
        
        let errorMessage = "AI Service Error";
        if (error.message?.includes("API_KEY_INVALID")) errorMessage = "Invalid Gemini API Key";
        if (error.message?.includes("quota")) errorMessage = "AI Limit exceeded (Quota)";

        // Return 200 even on error so the frontend can show the 'reason' containing the error
        res.status(200).json({ 
            message: errorMessage,
            label: "SUSPICIOUS",
            confidence: 0,
            reason: `AI Analysis Failed: ${error.message}. Please check your API key and connection.`
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
