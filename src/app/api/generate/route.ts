import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, negativePrompt, numImages } = await req.json();

    const fullPrompt = negativePrompt
      ? `${prompt}. Avoid: ${negativePrompt}`
      : prompt;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: numImages,
      size: "1792x1024",
      quality: "standard",
      style: "natural",
    });

    return NextResponse.json({ images: response.data });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
