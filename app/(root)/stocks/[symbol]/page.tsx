import React from "react";
import TradingViewWidget from "@/forms/TradingViewWidget";
import {
  CANDLE_CHART_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import WatchlistButton from "@/forms/WatchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { checkIsWatched } from "@/lib/actions/watchlist.actions";

export default async function StockDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = await params;
  const ticker = decodeURIComponent(resolvedParams.symbol).toUpperCase();

  const scriptUrl = "https://s3.tradingview.com/external-embedding/";

  const session = await auth.api.getSession({ headers: await headers() });

  const userId = session?.user?.id ?? "";
  const isWatched = await checkIsWatched(userId, ticker);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 px-4 md:px-6 xl:px-8 py-6 pb-16">
      
      {/* Main Layout */}
      <div className="max-w-400 mx-auto grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col gap-6">
          
          {/* Symbol Info */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-[#141414] shadow-xl hover:border-zinc-700 transition">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(ticker)}
              height={160}
            />
          </div>

          {/* Chart */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-[#141414] shadow-xl hover:border-zinc-700 transition">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(ticker)}
              height={600}
            />
          </div>

          {/* Profile */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-[#141414] shadow-xl hover:border-zinc-700 transition">
            <div className="px-4 py-2 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60">
              Company Profile
            </div>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-symbol-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(ticker)}
              height={400}
            />
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="flex flex-col gap-6 xl:sticky xl:top-20 h-fit">
          
          {/* Watchlist */}
          <WatchlistButton
            userId={userId}
            symbol={ticker}
            companyName={ticker}
            initialIsWatched={isWatched}
          />

          {/* Technical Analysis */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-[#141414] shadow-xl hover:border-zinc-700 transition">
            <div className="px-4 py-2 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60">
              Technical Analysis
            </div>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(ticker)}
              height={450}
            />
          </div>

          {/* Financials */}
              <div className="rounded-xl border border-zinc-800/80 bg-[#141414] shadow-xl">
      <TradingViewWidget
        scriptUrl={`${scriptUrl}embed-widget-financials.js`}
        config={COMPANY_FINANCIALS_WIDGET_CONFIG(ticker)}
        height={450}
      />
    </div>

          {/* Optional News */}
          {/*
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-[#141414] shadow-xl">
            <div className="px-4 py-2 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60">
              Live News
            </div>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-timeline.js`}
              config={SYMBOL_NEWS_WIDGET_CONFIG(ticker)}
              height={550}
            />
          </div>
          */}
        </div>
      </div>

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none bg-linear-to-br from-[#00D09E]/5 via-transparent to-transparent"></div>
    </div>
  );
}
