"use client";

import { Download, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useEmojiStore } from "@/store/useEmojiStore";
import { useCallback, useMemo } from "react";

export default function EmojiGrid() {
  // Create a fixed array of 6 grid positions
  const GRID_POSITIONS = useMemo(
    () => [
      { id: "pos-0", index: 0 },
      { id: "pos-1", index: 1 },
      { id: "pos-2", index: 2 },
      { id: "pos-3", index: 3 },
    ],
    [],
  );

  const emojis = useEmojiStore((state) => state.emojis);
  const likeEmoji = useEmojiStore((state) => state.likeEmoji);

  const handleDownload = useCallback(async (emojiData: string) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 128;
      canvas.height = 128;

      ctx.font = "96px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emojiData, canvas.width / 2, canvas.height / 2);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/png"),
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `emoji-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download emoji:", error);
    }
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
      {GRID_POSITIONS.map((position) => {
        const emojiData = emojis[position.index];

        return (
          <div key={position.id} className="relative group aspect-square">
            <div className="w-full h-full rounded-lg bg-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center text-6xl">
              {emojiData && (
                <span className="select-none">{emojiData.emoji}</span>
              )}
            </div>
            {emojiData && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/20 hover:bg-white/40"
                  onClick={() => handleDownload(emojiData.emoji)}
                >
                  <Download className="h-4 w-4 text-white" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/20 hover:bg-white/40 relative"
                  onClick={() => likeEmoji(emojiData.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${emojiData.likes > 0 ? "text-red-500 fill-red-500" : "text-white"}`}
                  />
                  {emojiData.likes > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {emojiData.likes}
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
