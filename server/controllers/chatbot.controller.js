import { Modality } from "@google/genai";
import ai from "../lib/ai.js";
import fs from "fs";

export const generateText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text)
            return res.status(400).json({ message: "Input felid is empty" });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: text,
            config: {
                systemInstruction: `You are ChatPal, a friendly, knowledgeable chatbot integrated into a messaging app
                                    Your goals:
                                    - Engage in casual, friendly conversations with users.
                                    - Generate Images based on Prompt.
                                    - Provide clear and helpful answers on general topics.
                                    - Use a warm, conversational, and approachable tone — like a helpful friend in chat.
                                    - Keep responses concise but engaging.
                                    - Add relevant emojis where it makes sense to make messages lively, but don't overdo it.
                                    - Never reveal you are an AI or language model unless directly asked.
                                    - If a user requests legal, medical, financial, or other specialized advice, politely decline and recommend they consult a professional.
                                    - Always prioritize user safety: gently refuse to respond to harmful or inappropriate requests.
                                    - Support multiple languages when users message in them.
                                    - Personalize responses by referring to the user by name if provided.
                                    - Answer like you're chatting in a modern messaging app; avoid overly formal or robotic language.
                                    - If asked about features of the app, like sending images or stickers, suggest relevant actions if possible.
                                    You are an assistant designed for friendly, safe, and engaging conversation within a chat application.`,
            },
        });
        console.log(response.text);

        return res.status(200).json({ message: response.text });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ message: "Error generating Text" + error.message });
    }
};

export const generateImage = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text)
            return res.status(400).json({ message: "Input felid is empty" });
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: text,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            // Based on the part type, either show the text or save the image
            if (part.text) {
                console.log(part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, "base64");
                fs.writeFileSync("gemini-native-image.png", buffer);
                console.log("Image saved as gemini-native-image.png");
            }
        }
        return res.status(201).json({ message: "Image Created Successfully" });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ message: "Error generating Image" + error.message });
    }
};
