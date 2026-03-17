/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Optional: helps with screen readers

// Hardcoded popular stocks to match the screenshot's default state
const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc", type: "Common Stock" },
  { symbol: "MSFT", name: "Microsoft Corp", type: "Common Stock" },
  { symbol: "GOOGL", name: "Alphabet Inc", type: "Common Stock" },
  { symbol: "AMZN", name: "Amazon.com Inc", type: "Common Stock" },
  { symbol: "TSLA", name: "Tesla Inc", type: "Common Stock" },
  { symbol: "META", name: "Meta Platforms Inc", type: "Common Stock" },
  { symbol: "NVDA", name: "NVIDIA Corp", type: "Common Stock" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch from Finnhub when the query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        const res = await fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`);
        const data = await res.json();
        
        // Filter for actual stocks
        const stocks = data.result?.filter((item: any) => 
          item.type === "Common Stock" || item.type === "ETP"
        ) || [];
        setResults(stocks);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search so we don't spam the API on every keystroke
    const timeoutId = setTimeout(fetchResults, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (symbol: string) => {
    setQuery("");
    onClose(); // Close the modal
    router.push(`/stocks/${symbol}`); // Route to your dynamic page
  };

  const displayList = query.trim() ? results : POPULAR_STOCKS;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 bg-[#141414] border-zinc-800 text-zinc-100 max-w-2xl gap-0 overflow-hidden shadow-2xl rounded-xl">
        
        {/* Accessible Title (Hidden from UI but required by Dialog) */}
        <VisuallyHidden>
          <DialogTitle>Search Stocks</DialogTitle>
        </VisuallyHidden>

        {/* Search Input Area */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-800/80">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-500 text-lg"
          />
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold text-zinc-500 bg-[#0a0a0a]">
            {query.trim() ? "Search Results" : `Popular stocks (${POPULAR_STOCKS.length})`}
          </div>

          <div className="flex flex-col py-2">
            {displayList.length === 0 && !isLoading ? (
              <div className="px-6 py-8 text-center text-zinc-500">
                No results found for "{query}"
              </div>
            ) : (
              displayList.map((stock: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSelect(stock.symbol || stock.displaySymbol)}
                  className="flex flex-col text-left px-6 py-3 hover:bg-[#202020] transition-colors group outline-none focus:bg-[#202020]"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400" />
                    <span className="font-semibold text-zinc-200">
                      {stock.name || stock.description}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 ml-7 mt-0.5">
                    {stock.symbol || stock.displaySymbol} | {stock.type}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}