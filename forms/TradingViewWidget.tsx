"use client";

import React, { useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const TradingViewWidget = ({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify(config);
      container.current.appendChild(script);

      return () => {
        if (container.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          container.current.innerHTML = "";
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3 className="font-semibold text-xl text-zinc-100 mb-4 px-1">
          {title}
        </h3>
      )}

      {/* Zero custom CSS classes. 
        Just the ref for the script, and Tailwind for styling. 
      */}
      <div
        ref={container}
        className="w-full overflow-hidden rounded-xl border border-zinc-800/80 shadow-xl"
        style={{ height }}
      />
    </div>
  );
};

export default memo(TradingViewWidget);
