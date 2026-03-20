import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketData } from "../api/markets";
import PriceDisplay from "../components/PriceDisplay";

const PRESET_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <svg
        className="animate-spin h-8 w-8 text-brand-400"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-100 font-mono">{value}</p>
    </div>
  );
}

function formatNumber(value: string, decimals = 2): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000)
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  return num.toFixed(decimals);
}

function formatPrice(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  if (num >= 1000)
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return num.toFixed(4);
  return num.toFixed(8);
}

export default function MarketData() {
  const [inputSymbol, setInputSymbol] = useState("BTCUSDT");
  const [activeSymbol, setActiveSymbol] = useState("BTCUSDT");

  const {
    data: market,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["market", activeSymbol],
    queryFn: () => getMarketData(activeSymbol),
    enabled: !!activeSymbol,
    refetchInterval: 30_000, // auto-refresh every 30s
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sym = inputSymbol.trim().toUpperCase();
    if (sym) setActiveSymbol(sym);
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Market Data</h1>
        <p className="text-sm text-gray-500 mt-1">
          Live prices and 24-hour statistics
        </p>
      </div>

      {/* Symbol Selector */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Select Symbol
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_SYMBOLS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setInputSymbol(s);
                setActiveSymbol(s);
              }}
              className={[
                "px-3 py-1.5 text-sm rounded-lg font-medium transition-colors",
                activeSymbol === s
                  ? "bg-brand-500 text-gray-950"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
          <input
            className="input flex-1 uppercase"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
            placeholder="Enter symbol, e.g. DOGEUSDT"
          />
          <button type="submit" className="btn-primary px-4">
            Search
          </button>
        </form>
      </section>

      {/* Loading / Error */}
      {isLoading && <Spinner />}
      {error && <ErrorBanner message={(error as Error).message} />}

      {/* Price Display */}
      {market && (
        <>
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Current Price
              </h2>
              {isFetching && !isLoading && (
                <svg
                  className="animate-spin h-3.5 w-3.5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
            </div>
            <PriceDisplay
              symbol={market.symbol}
              price={market.lastPrice}
              priceChangePercent={market.priceChangePercent}
            />
          </section>

          {/* 24h Stats */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
              24-Hour Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard
                label="Open"
                value={formatPrice(market.openPrice)}
              />
              <StatCard
                label="24h High"
                value={formatPrice(market.highPrice)}
              />
              <StatCard
                label="24h Low"
                value={formatPrice(market.lowPrice)}
              />
              <StatCard
                label="Prev Close"
                value={formatPrice(market.prevClosePrice)}
              />
              <StatCard
                label="Bid"
                value={formatPrice(market.bidPrice)}
              />
              <StatCard
                label="Ask"
                value={formatPrice(market.askPrice)}
              />
              <StatCard
                label="Volume"
                value={formatNumber(market.volume, 4)}
              />
              <StatCard
                label="Quote Volume"
                value={formatNumber(market.quoteVolume)}
              />
            </div>
          </section>

          {/* Price Change */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Price Change
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-sm">
              <StatCard
                label="Change (absolute)"
                value={(() => {
                  const n = parseFloat(market.priceChange);
                  const formatted = formatPrice(String(Math.abs(n)));
                  return `${n >= 0 ? "+" : "-"}${formatted}`;
                })()}
              />
              <StatCard
                label="Change (%)"
                value={(() => {
                  const n = parseFloat(market.priceChangePercent);
                  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
                })()}
              />
            </div>
          </section>

          {/* Timestamps */}
          <section>
            <p className="text-xs text-gray-600">
              Window: {new Date(market.openTime).toLocaleString()} —{" "}
              {new Date(market.closeTime).toLocaleString()} &nbsp;·&nbsp; Auto-refreshes every
              30 seconds.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
