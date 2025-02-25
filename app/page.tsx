"use client";

import EmojiGenerator from "@/components/EmojiGenerator";
import EmojiGrid from "@/components/EmojiGrid";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      <BackgroundBeamsWithCollision />
      <div className="relative z-10 min-h-screen p-8 flex flex-col items-center gap-12">
        <header className="flex items-center gap-2 text-2xl font-bold text-white">
          <span role="img" aria-label="emoji" className="text-3xl">
            ✨
          </span>
          <h1>Emoji Maker</h1>
        </header>

        <main className="w-full flex flex-col items-center gap-12">
          <EmojiGenerator />
          <EmojiGrid />
        </main>
      </div>
    </div>
  );
}
