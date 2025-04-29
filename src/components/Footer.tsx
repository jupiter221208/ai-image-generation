"use client";

import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row py-6 md:py-0">
      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
        Built with Next.js and AI. View source on&nbsp;
        <a
          href="https://github.com/jupiter221208/ai-image-generation"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </a>
      </p>
      <a
        href="https://github.com/jupiter221208/ai-image-generation"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <Github className="h-4 w-4" />
        <span>Star on GitHub</span>
      </a>
    </footer>
  );
}
