import React from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import TradingViewWidget from "@/forms/TradingViewWidget";
import { Bookmark, ExternalLink } from "lucide-react";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

// Initialize Supabase (Ensure these are in your .env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function WatchlistPage() {
  // Replace with your actual Better-Auth user ID retrieval
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  
  if (!userId) {
    return <div>Please log in to view your watchlist.</div>; // Or redirect
  }

  // Fetch the user's saved stocks from Supabase
  const { data: savedStocks, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Error fetching watchlist:", error);
  }

  const scriptUrl = "https://s3.tradingview.com/external-embedding/";

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-400 mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-end justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-[#FFD700]" />
              My Watchlist
            </h1>
            <p className="text-zinc-400 mt-2">Monitor your saved assets and market opportunities.</p>
          </div>
        </div>

        {/* Empty State */}
        {(!savedStocks || savedStocks.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 bg-[#141414] rounded-2xl border border-zinc-800/50 border-dashed">
            <Bookmark className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-300">Your watchlist is empty</h3>
            <p className="text-zinc-500 mt-2 mb-6">Search for companies to add them to your radar.</p>
            <Link 
              href="/search" 
              className="px-6 py-3 bg-zinc-100 text-black font-semibold rounded-xl hover:bg-zinc-300 transition-colors"
            >
              Explore the Market
            </Link>
          </div>
        )}

        {/* Watchlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedStocks?.map((stock) => (
            <div key={stock.id} className="group relative rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl bg-[#141414] hover:border-zinc-600 transition-colors">
              
              {/* Clickable Overlay to route to stock page */}
              <Link href={`/stocks/${stock.symbol}`} className="absolute inset-0 z-10" />
              
              <div className="p-1 pointer-events-none">
                {/* Mini Live Ticker Widget */}
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}embed-widget-single-quote.js`}
                  config={{
                    symbol: stock.symbol,
                    width: "100%",
                    colorTheme: "dark",
                    isTransparent: true,
                    locale: "en"
                  }}
                  height={120}
                />
              </div>

              <div className="px-5 py-4 border-t border-zinc-800/50 bg-[#0a0a0a] flex justify-between items-center relative z-20">
                 <div>
                    <span className="text-xs text-zinc-500 block mb-1">Added {new Date(stock.added_at).toLocaleDateString()}</span>
                 </div>
                 <Link href={`/stocks/${stock.symbol}`} className="text-[#00D09E] hover:text-emerald-400 flex items-center gap-1 text-sm font-semibold transition-colors">
                    Analyze <ExternalLink className="w-4 h-4" />
                 </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}