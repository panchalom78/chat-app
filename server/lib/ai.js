import { GoogleGenAI, Modality } from "@google/genai";
import { config } from "dotenv";
import fs from "fs";
import { sendMessage } from "./util.js";
import cloudinary from "./cloudinary.js";

config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

export const generateText = async (text, senderId) => {
    try {
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
                                    - If user ask if you can generate image or ask to generate any image reply with telling the user to start the prompt with "Generate image of ..." for generating image and keep it short to one line
        
                                    You are an assistant designed for friendly, safe, and engaging conversation within a chat application.`,
                tools: [
                    {
                        googleSearch: {},
                    },
                ],
            },
        });
        console.log(response.text);
        await sendMessage(response.text, "", senderId);
    } catch (error) {
        console.log(error);
    }
};

export const generateImage = async (text, senderId) => {
    try {
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
                // const buffer = Buffer.from(imageData, "base64");
                // fs.writeFileSync(imageName, buffer);
                const dataUri = "data:image/png;base64," + imageData;
                const uploadResponse = await cloudinary.uploader.upload(
                    dataUri
                );
                const imageUrl = uploadResponse.secure_url;
                await sendMessage("", imageUrl, senderId);
            }
        }
    } catch (error) {
        await sendMessage(
            "Failed to generate image. Please to try again.",
            "",
            senderId
        );
        console.log(error);
    }
};
