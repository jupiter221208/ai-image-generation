"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormData {
  prompt: string;
  negativePrompt?: string;
  numImages: number;
  model: string;
  openaiApiKey?: string;
  stabilityApiKey?: string;
  googleApiKey?: string;
}

interface GeneratedImage {
  url: string;
}

const MODELS = [
  { id: "dall-e-3", name: "DALL-E 3 (OpenAI)", maxImages: 1 },
  { id: "dall-e-2", name: "DALL-E 2 (OpenAI)", maxImages: 4 },
  { id: "stable-diffusion", name: "Stable Diffusion", maxImages: 4 },
  { id: "gemini", name: "Gemini (Google)", maxImages: 1 },
];

export function ImageGenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState<string>("");

  const form = useForm<FormData>({
    defaultValues: {
      prompt: "",
      negativePrompt: "",
      numImages: 1,
      model: "dall-e-3",
      openaiApiKey: "",
      stabilityApiKey: "",
      googleApiKey: "",
    },
  });

  const selectedModel = MODELS.find((m) => m.id === form.watch("model"));

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      setStatus("Initializing image generation...");
      toast.info(
        `Generating ${data.numImages} image(s) with ${selectedModel?.name} using prompt: ${data.prompt}`
      );

      setStatus("Sending request to AI model...");
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
      toast.error("Failed to generate images:");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Model</label>
          <Select
            onValueChange={(value) => {
              form.setValue("model", value);
              form.setValue("numImages", 1);
            }}
            defaultValue={form.getValues("model")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedModel?.id.startsWith("dall-e") && (
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <Input
              type="password"
              {...form.register("openaiApiKey", { required: true })}
              placeholder="Enter your OpenAI API key"
            />
          </div>
        )}

        {selectedModel?.id === "stable-diffusion" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Stability AI API Key</label>
            <Input
              type="password"
              {...form.register("stabilityApiKey", { required: true })}
              placeholder="Enter your Stability AI API key"
            />
          </div>
        )}

        {selectedModel?.id === "gemini" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Google API Key</label>
            <Input
              type="password"
              {...form.register("googleApiKey", { required: true })}
              placeholder="Enter your Google API key"
            />
          </div>
        )}

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
              max: selectedModel?.maxImages || 1,
            })}
            min={1}
            max={selectedModel?.maxImages || 1}
          />
          <p className="text-xs text-muted-foreground">
            Maximum {selectedModel?.maxImages} image(s) for{" "}
            {selectedModel?.name}
          </p>
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
