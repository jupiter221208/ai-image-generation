"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">AI Image Gen</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/gallery">Gallery</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
