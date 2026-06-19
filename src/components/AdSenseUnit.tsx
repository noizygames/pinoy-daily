"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export default function AdSenseUnit() {
  useEffect(() => {
    if (!ADSENSE_SLOT) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense may not be ready yet
    }
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white px-2 py-3 shadow-sm">
      <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-widest text-neutral-400">
        Advertisement
      </p>
      {ADSENSE_SLOT ? (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight: 100 }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="flex min-h-[100px] w-full items-center justify-center rounded-xl bg-neutral-50 text-xs text-neutral-400"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
