"use client";

import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    // Load images from localStorage on component mount
    const savedImages = localStorage.getItem("generatedImages");
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

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
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <Image
                src={image.url}
                alt={image.prompt}
                width={512}
                height={512}
                className="aspect-square w-full object-cover"
                unoptimized
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
