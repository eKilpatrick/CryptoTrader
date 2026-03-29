import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getMarketData, getPriceHistory } from "../api/markets";
import type { Candle } from "../api/markets";
import PriceDisplay from "../components/PriceDisplay";

const PRESET_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];
const PERIODS = ["1h", "24h", "7d", "1m", "1y", "3y"];

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

function InlineSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-gray-500"
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

function formatCandleTime(ts: number, period: string): string {
  const d = new Date(ts);
  if (period === "1h" || period === "24h") {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  if (period === "7d") {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  if (period === "1m" || period === "1y") {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  // 3y
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

interface ChartCandle {
  time: number;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function toChartData(candles: Candle[], period: string): ChartCandle[] {
  return candles.map((c) => ({
    time: c.time,
    label: formatCandleTime(c.time, period),
    open: parseFloat(c.open),
    high: parseFloat(c.high),
    low: parseFloat(c.low),
    close: parseFloat(c.close),
    volume: parseFloat(c.volume),
  }));
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartCandle }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isUp = d.close >= d.open;
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs space-y-1 shadow-lg">
      <p className="text-gray-400">{d.label}</p>
      <p className={isUp ? "text-green-400 font-mono" : "text-red-400 font-mono"}>
        Close: {formatPrice(String(d.close))}
      </p>
      <p className="text-gray-400 font-mono">O: {formatPrice(String(d.open))}</p>
      <p className="text-gray-400 font-mono">H: {formatPrice(String(d.high))}</p>
      <p className="text-gray-400 font-mono">L: {formatPrice(String(d.low))}</p>
      <p className="text-gray-400 font-mono">Vol: {formatNumber(String(d.volume), 4)}</p>
    </div>
  );
}

export default function MarketData() {
  const [inputSymbol, setInputSymbol] = useState("BTCUSDT");
  const [activeSymbol, setActiveSymbol] = useState("BTCUSDT");
  const [activePeriod, setActivePeriod] = useState("24h");

  const {
    data: market,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["market", activeSymbol],
    queryFn: () => getMarketData(activeSymbol),
    enabled: !!activeSymbol,
    refetchInterval: 30_000,
  });

  const {
    data: history,
    isLoading: historyLoading,
    isFetching: historyFetching,
    error: historyError,
  } = useQuery({
    queryKey: ["history", activeSymbol, activePeriod],
    queryFn: () => getPriceHistory(activeSymbol, activePeriod),
    enabled: !!activeSymbol,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sym = inputSymbol.trim().toUpperCase();
    if (sym) setActiveSymbol(sym);
  }

  const chartData = history ? toChartData(history.candles, activePeriod) : [];

  // Compute Y axis domain with a little padding
  const closes = chartData.map((c) => c.close);
  const yMin = closes.length ? Math.min(...closes) : undefined;
  const yMax = closes.length ? Math.max(...closes) : undefined;
  const yPad = yMin !== undefined && yMax !== undefined ? (yMax - yMin) * 0.05 : 0;

  // Determine chart stroke color from first/last close
  const isChartUp =
    chartData.length >= 2
      ? chartData[chartData.length - 1].close >= chartData[0].close
      : true;
  const chartColor = isChartUp ? "#22c55e" : "#ef4444";

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
              <StatCard label="Open" value={formatPrice(market.openPrice)} />
              <StatCard label="24h High" value={formatPrice(market.highPrice)} />
              <StatCard label="24h Low" value={formatPrice(market.lowPrice)} />
              <StatCard label="Prev Close" value={formatPrice(market.prevClosePrice)} />
              <StatCard label="Bid" value={formatPrice(market.bidPrice)} />
              <StatCard label="Ask" value={formatPrice(market.askPrice)} />
              <StatCard label="Volume" value={formatNumber(market.volume, 4)} />
              <StatCard label="Quote Volume" value={formatNumber(market.quoteVolume)} />
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

          {/* Price History Chart */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Price History
              </h2>
              {historyFetching && !historyLoading && <InlineSpinner />}
            </div>

            {/* Period selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePeriod(p)}
                  className={[
                    "px-3 py-1.5 text-sm rounded-lg font-medium transition-colors",
                    activePeriod === p
                      ? "bg-brand-500 text-gray-950"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100",
                  ].join(" ")}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>

            {historyLoading && <Spinner />}
            {historyError && (
              <ErrorBanner message={(historyError as Error).message} />
            )}

            {chartData.length > 0 && (
              <div className="card p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      orientation="right"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => formatPrice(String(v))}
                      domain={
                        yMin !== undefined && yMax !== undefined
                          ? [yMin - yPad, yMax + yPad]
                          : ["auto", "auto"]
                      }
                      width={80}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={chartColor}
                      strokeWidth={1.5}
                      fill="url(#chartGradient)"
                      dot={false}
                      activeDot={{ r: 4, fill: chartColor }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
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
