"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useEmojiStore } from "@/store/useEmojiStore";

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const addEmoji = useEmojiStore((state) => state.addEmoji);

  const handleGenerate = async () => {
    if (!prompt) return;

    try {
      setIsGenerating(true);
      setError("");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate emoji");
      }

      if (data.emoji) {
        addEmoji(data.emoji);
      }

      setPrompt("");
    } catch (err) {
      setError("Failed to generate emoji. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex flex-col gap-4">
        <p className="text-center text-lg text-white">
          Enter a word to find a matching emoji
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Was using Replicate SDXL emoji API which was generating iPhone
          equivalent aesthetic emoji but sadly :( it&apos;s paid now so had to
          change it to emoji-api.com
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter a prompt to generate an emoji"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
