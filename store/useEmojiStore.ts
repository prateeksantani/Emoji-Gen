import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EmojiData {
  id: string;
  emoji: string;
  likes: number;
  createdAt: number;
}

interface EmojiStore {
  emojis: EmojiData[];
  addEmoji: (emoji: string) => void;
  likeEmoji: (id: string) => void;
  clearEmojis: () => void;
}

export const useEmojiStore = create<EmojiStore>()(
  persist(
    (set) => ({
      emojis: [],
      addEmoji: (emoji) => set((state) => ({ 
        emojis: [{
          id: crypto.randomUUID(),
          emoji,
          likes: 0,
          createdAt: Date.now()
        }, ...state.emojis]
      })),
      likeEmoji: (id) => set((state) => ({
        emojis: state.emojis.map((emoji) =>
          emoji.id === id ? { ...emoji, likes: emoji.likes + 1 } : emoji
        )
      })),
      clearEmojis: () => set({ emojis: [] }),
    }),
    {
      name: 'emoji-storage',
    }
  )
); 