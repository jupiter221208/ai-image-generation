"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface FormData {
  prompt: string;
  negativePrompt?: string;
  numImages: number;
}

interface GeneratedImage {
  url: string;
}

export function ImageGenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState<string>("");

  const form = useForm<FormData>({
    defaultValues: {
      prompt: "",
      negativePrompt: "",
      numImages: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      setStatus("Initializing image generation...");
      toast.info(
        `Generating ${data.numImages} image(s) with prompt: ${data.prompt}`
      );

      setStatus("Sending request to DALL-E...");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate images");
      }

      setStatus("Processing response...");
      const result = await response.json();
      setGeneratedImages(result.images);
      setStatus("Images generated successfully!");
      toast.success("Images generated successfully!");
    } catch (error) {
      setStatus("Error generating images");
      toast.error("Failed to generate images");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea
            {...form.register("prompt", { required: true })}
            placeholder="Describe the image you want to generate..."
            className="h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Negative Prompt (Optional)
          </label>
          <Textarea
            {...form.register("negativePrompt")}
            placeholder="Describe what you don't want in the image..."
            className="h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Images</label>
          <Input
            type="number"
            {...form.register("numImages", {
              required: true,
              min: 1,
              max: 4,
            })}
            min={1}
            max={4}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Images"}
        </Button>

        {isGenerating && (
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300 animate-pulse"
                style={{ width: "100%" }}
              />
            </div>
            <p className="text-sm text-center text-gray-500">{status}</p>
          </div>
        )}
      </form>

      {generatedImages.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {generatedImages.map((image, index) => (
            <Image
              key={index}
              src={image.url}
              alt={`Generated image ${index + 1}`}
              width={512}
              height={512}
              className="rounded-lg shadow-md"
              unoptimized
            />
          ))}
        </div>
      )}
    </Card>
  );
}
