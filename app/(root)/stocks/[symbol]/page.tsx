import React from "react";
import TradingViewWidget from "@/forms/TradingViewWidget";
import { 
  CANDLE_CHART_WIDGET_CONFIG, 
  SYMBOL_INFO_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import WatchlistButton from "@/forms/WactchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { checkIsWatched } from "@/lib/actions/watchlist.actions";



export default async function StockDetailsPage({ 
  params 
}: { 
  params: Promise<{ symbol: string }> 
}) {
  const resolvedParams = await params;
  const ticker = decodeURIComponent(resolvedParams.symbol).toUpperCase();
  
  const scriptUrl = "https://s3.tradingview.com/external-embedding/";

  const session = await auth.api.getSession({ headers: await headers() });

  const userId = session?.user?.id ?? "";
  const isWatched = await checkIsWatched(userId, ticker);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 md:p-6 pb-16">
      <div className="max-w-400 mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ======================================= */}
        {/* LEFT COLUMN (2/3 Width) - Primary Charts */}
        {/* ======================================= */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* 1. Symbol Info Header */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl bg-[#141414]">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(ticker)}
              height={170}
            />
          </div>

          {/* 2. Advanced Candlestick Chart */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl bg-[#141414]">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(ticker)}
              height={600}
            />
          </div>

          {/* 3. Company Profile */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl bg-[#141414]">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-symbol-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(ticker)}
              height={440}
            />
          </div>
          
        </div>

        {/* ========================================= */}
        {/* RIGHT COLUMN (1/3 Width) - Analytics      */}
        {/* ========================================= */}
        <div className="flex flex-col gap-6">
          
          {/* 1. Watchlist Button */}
          <WatchlistButton
            userId={userId}
            symbol={ticker}
            companyName={ticker}
            initialIsWatched={isWatched}
          />

          {/* 2. Technical Analysis Gauge */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl bg-[#141414]">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(ticker)}
              height={400}
            />
          </div>

          {/* 3. Company Financials */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl bg-[#141414]">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(ticker)}
              height={564}
            />
          </div>

          {/* 4. Contextual Company News (Uncommented and Fixed) */}
          {/* <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl bg-[#141414]">
            <div className="px-4 py-3 border-b border-zinc-800/50 bg-gradient-to-r from-[#0a0a0a] to-[#141414]">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <span className="w-1 h-4 bg-[#FFD700] rounded-full mr-2"></span>
                Live {ticker} News
              </h3>
            </div>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}embed-widget-timeline.js`}
              config={SYMBOL_NEWS_WIDGET_CONFIG(ticker)}
              height={550}
            />
          </div> */}

        </div>
      </div>

      {/* Optional: Add subtle gradient background effect */}
      {/* <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent"></div> */}
    </div>
  );
}