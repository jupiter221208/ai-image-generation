import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_HOST = "https://api.stability.ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

interface StabilityArtifact {
  base64: string;
  seed: number;
  finishReason: string;
}

interface StabilityResponse {
  artifacts: StabilityArtifact[];
}

export async function POST(req: Request) {
  try {
    const { prompt, negativePrompt, numImages, model } = await req.json();

    if (model.startsWith("dall-e")) {
      const fullPrompt = negativePrompt
        ? `${prompt}. Avoid: ${negativePrompt}`
        : prompt;

      const response = await openai.images.generate({
        model: model,
        prompt: fullPrompt,
        n: numImages,
        size: "1024x1024",
        quality: "standard",
        style: "natural",
      });

      return NextResponse.json({ images: response.data });
    }

    if (model === "stable-diffusion") {
      console.log("Generating images with Stable Diffusion");
      if (!STABILITY_API_KEY) {
        console.error("Stability API key not configured");
        return NextResponse.json(
          { error: "Stability API key not configured" },
          { status: 500 }
        );
      }

      const response = await fetch(
        `${STABILITY_API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${STABILITY_API_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: prompt,
                weight: 1,
              },
              ...(negativePrompt
                ? [
                    {
                      text: negativePrompt,
                      weight: -1,
                    },
                  ]
                : []),
            ],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: numImages,
            steps: 30,
            style_preset: "photographic",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to generate images with Stable Diffusion"
        );
      }

      const result = (await response.json()) as StabilityResponse;
      const images = result.artifacts.map((artifact) => ({
        url: `data:image/png;base64,${artifact.base64}`,
      }));

      return NextResponse.json({ images });
    }

    if (model === "gemini") {
      if (!process.env.GOOGLE_API_KEY) {
        return NextResponse.json(
          { error: "Google API key not configured" },
          { status: 500 }
        );
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: "", // Empty data as we're generating images
          },
        },
      ]);

      const response = await result.response;
      if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Failed to generate image with Gemini");
      }
      const imageData = response.candidates[0].content.parts[0].text;

      // Convert the generated image data to a URL
      const imageUrl = `data:image/jpeg;base64,${imageData}`;

      return NextResponse.json({ images: [{ url: imageUrl }] });
    }

    return NextResponse.json(
      { error: "This model is not implemented yet" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
