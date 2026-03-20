"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";
import { Loader2, Bookmark, BookmarkCheck } from "lucide-react";

interface WatchlistButtonProps {
  userId: string;
  symbol: string;
  companyName?: string;
  initialIsWatched: boolean;
}

export default function WatchlistButton({ 
  userId, 
  symbol, 
  companyName = "Unknown", 
  initialIsWatched 
}: WatchlistButtonProps) {
  const [isWatched, setIsWatched] = useState(initialIsWatched);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    // Call our server action
    const res = await toggleWatchlist(userId, symbol, companyName);
    
    if (res.success && res.isWatched !== undefined) {
      setIsWatched(res.isWatched);
    }
    setIsLoading(false);
  };

  return (
    <Button 
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-full h-14 font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2
        ${isWatched 
          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-none" 
          : "bg-[#FFD700] hover:bg-[#F0C800] text-black shadow-[0_0_15px_rgba(255,215,0,0.15)]"
        }
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isWatched ? (
        <>
          <BookmarkCheck className="w-5 h-5" />
          Saved to Watchlist
        </>
      ) : (
        <>
          <Bookmark className="w-5 h-5" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}