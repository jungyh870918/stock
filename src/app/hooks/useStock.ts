"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { StockData, ApiError } from "@/app/lib/finnhub.types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: StockData }
  | { status: "error"; message: string };

const POLL_INTERVAL_MS = 60_000; // 1분마다 갱신

export function useStock(symbol: string | null) {
  const [state, setState] = useState<State>({ status: "idle" });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (sym: string) => {
    setState((prev) => (prev.status === "success" ? prev : { status: "loading" }));
    try {
      const res = await fetch(`/api/stock/${encodeURIComponent(sym)}`);
      const json = await res.json();
      if (!res.ok) {
        setState({ status: "error", message: (json as ApiError).error });
        return;
      }
      setState({ status: "success", data: json as StockData });
    } catch {
      setState({ status: "error", message: "네트워크 오류가 발생했습니다." });
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!symbol) {
      setState({ status: "idle" });
      return;
    }

    fetchData(symbol);
    timerRef.current = setInterval(() => fetchData(symbol), POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [symbol, fetchData]);

  const refresh = useCallback(() => {
    if (symbol) fetchData(symbol);
  }, [symbol, fetchData]);

  return { state, refresh };
}
