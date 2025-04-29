import { Header } from "@/components/Header";
import { ImageGenerationForm } from "@/components/ImageGenerationForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              AI Image Generation
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Create stunning images using artificial intelligence. Just
              describe what you want to see!
            </p>
          </div>
          <ImageGenerationForm />
        </div>
      </div>
    </main>
  );
}
