import React from "react";
import Navbar from "@/components/Navbar"; // Import the separated Nav
import TradingViewWidget from "@/forms/TradingViewWidget";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { 
  HEATMAP_WIDGET_CONFIG, 
  MARKET_DATA_WIDGET_CONFIG, 
  MARKET_OVERVIEW_WIDGET_CONFIG, 
  TOP_STORIES_WIDGET_CONFIG 
} from "@/lib/constants";

// NOTICE: No "use client" here. This is now a secure Server Component.
export default async function DashboardPage() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  // Fetch the session securely on the backend
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 pb-12">
      
      {/* Dynamic Header */}
      <Navbar user={user} />

      {/* MAIN DASHBOARD GRID */}
      <main className="max-w-400 mx-auto p-4 md:p-6 space-y-6 mt-2">
        
        {/* ROW 1: Market Overview (1/3) & Heatmap (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold tracking-tight text-zinc-100 px-1">Market Overview</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}market-overview.js`}
              config={MARKET_OVERVIEW_WIDGET_CONFIG}
              height={500}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            <h2 className="text-lg font-bold tracking-tight text-zinc-100 px-1">Stock Heatmap</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}stock-heatmap.js`}
              config={HEATMAP_WIDGET_CONFIG}
              height={500}
            />
          </div>
        </div>

        {/* ROW 2: Top Stories (1/3) & Market Data (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          <div className="flex flex-col gap-3 h-full">
            <h2 className="text-lg font-bold tracking-tight text-zinc-100 px-1">Top Stories</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}timeline.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              height={600}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-lg font-bold tracking-tight text-zinc-100">Market Data</h2>
            </div>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}market-quotes.js`}
              config={MARKET_DATA_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </div>

      </main>
    </div>
  );
}