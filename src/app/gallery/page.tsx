"use client";

import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";

// This would typically come from your database or API
const mockImages = [
  {
    id: 1,
    url: "https://placeholder.co/512x512",
    prompt: "A beautiful sunset over a mountain landscape",
    createdAt: "2024-03-20",
  },
  {
    id: 2,
    url: "https://placeholder.co/512x512",
    prompt: "A futuristic city with flying cars",
    createdAt: "2024-03-20",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Gallery</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse through your generated images
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <img
                src={image.url}
                alt={image.prompt}
                className="aspect-square w-full object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{image.prompt}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Generated on {image.createdAt}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
