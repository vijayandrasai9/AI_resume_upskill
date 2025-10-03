import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent("Hello Gemini");
  const response = await result.response;
  console.log(response.text());
}

main();