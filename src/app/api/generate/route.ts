import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const {
      prompt,
      negativePrompt,
      numImages,
      model,
      openaiApiKey,
      stabilityApiKey,
      googleApiKey,
    } = await req.json();

    if (model.startsWith("dall-e")) {
      if (!openaiApiKey) {
        return NextResponse.json(
          { error: "OpenAI API key is required" },
          { status: 400 }
        );
      }

      const openai = new OpenAI({
        apiKey: openaiApiKey,
      });

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
      if (!stabilityApiKey) {
        return NextResponse.json(
          { error: "Stability API key is required" },
          { status: 400 }
        );
      }

      const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${stabilityApiKey}`,
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
      if (!googleApiKey) {
        return NextResponse.json(
          { error: "Google API key is required" },
          { status: 400 }
        );
      }

      const genAI = new GoogleGenerativeAI(googleApiKey);
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
