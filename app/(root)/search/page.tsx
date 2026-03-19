/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, TrendingUp, Building2 } from "lucide-react";

interface FinnhubResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FinnhubResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      const stockResults =
        data.result?.filter(
          (item: FinnhubResult) =>
            item.type === "Common Stock" || item.type === "ETP"
        ) || [];

      setResults(stockResults);
    } catch (error) {
      console.error("Finnhub Search Error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToStock = (symbol: string) => {
    router.push(`/stocks/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto space-y-8 mt-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Market Intelligence
          </h1>
          <p className="text-zinc-400">
            Search for companies, tickers, or ETFs to view detailed analytics.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 'Apple' or 'AAPL'..."
              className="w-full h-14 pl-12 bg-[#141414] border-zinc-800 text-lg text-white focus-visible:ring-1 focus-visible:ring-emerald-500/50 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !query}
            className="h-14 px-8 bg-zinc-100 text-black hover:bg-zinc-300 rounded-xl font-semibold text-base"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </form>

        {/* Results */}
        <div className="mt-8 space-y-3">

          {/* ✅ FIXED LOADING BLOCK */}
          {isLoading && (
            <div className="text-center text-zinc-500 py-10">
              Scanning the market...
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="text-center text-zinc-500 py-10 bg-[#141414] rounded-xl border border-zinc-800/50">
              No matching assets found for "{query}".
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="bg-[#141414] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
              
              <div className="px-6 py-4 border-b border-zinc-800/50 bg-[#0a0a0a]">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Search Results
                </h3>
              </div>

              <div className="divide-y divide-zinc-800/50">
                {results.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => navigateToStock(stock.displaySymbol)}
                    className="flex items-center justify-between p-6 hover:bg-zinc-900/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500/20">
                        <Building2 className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-zinc-100">
                          {stock.displaySymbol}
                        </h4>
                        <p className="text-sm text-zinc-500 line-clamp-1">
                          {stock.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
                        {stock.type}
                      </span>
                      <TrendingUp className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}