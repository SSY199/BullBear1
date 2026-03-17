"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
// Make sure you have shadcn Avatar installed: npx shadcn@latest add avatar
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchModal from "@/forms/SearchModal";
import TradingViewWidget from "@/forms/TradingViewWidget";
import { 
  HEATMAP_WIDGET_CONFIG, 
  MARKET_DATA_WIDGET_CONFIG, 
  MARKET_OVERVIEW_WIDGET_CONFIG, 
  TOP_STORIES_WIDGET_CONFIG 
} from "@/lib/constants";

export default function DashboardPage() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 pb-12">

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#00D09E] to-[#3B82F6] rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(0,149,255,0.2)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
              <path d="M3 13L9 19L21 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[22px] font-bold tracking-tight text-zinc-100">Signalist</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-zinc-400">
          <Link href="/dashboard" className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Dashboard</Link>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Search
          </button>
          <Link href="/watchlist" className="hover:text-zinc-200 transition-colors">Watchlist</Link>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-zinc-700 shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SY</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-300 hidden sm:inline-block">SAHIL</span>
        </div>
      </nav>

      {/* 2. MAIN DASHBOARD GRID */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 mt-2">
        
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