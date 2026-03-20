interface PriceDisplayProps {
  symbol: string;
  price: string;
  priceChangePercent: string;
}

export default function PriceDisplay({
  symbol,
  price,
  priceChangePercent,
}: PriceDisplayProps) {
  const changeNum = parseFloat(priceChangePercent);
  const isPositive = changeNum >= 0;
  const priceNum = parseFloat(price);

  function formatPrice(val: number): string {
    if (isNaN(val)) return "—";
    if (val >= 1000) return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(4);
    return val.toFixed(8);
  }

  return (
    <div className="card flex items-center justify-between gap-6 flex-wrap">
      {/* Symbol */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-brand-400 font-bold text-sm">
          {symbol.slice(0, 3)}
        </div>
        <div>
          <p className="text-xs text-gray-500">Symbol</p>
          <p className="text-base font-bold text-gray-100">{symbol}</p>
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs text-gray-500 mb-0.5">Last Price</p>
        <p className="text-3xl font-bold text-gray-100">{formatPrice(priceNum)}</p>
      </div>

      {/* 24h Change */}
      <div>
        <p className="text-xs text-gray-500 mb-0.5">24h Change</p>
        <p
          className={[
            "text-2xl font-bold",
            isPositive ? "text-green-400" : "text-red-400",
          ].join(" ")}
        >
          {isPositive ? "+" : ""}
          {isNaN(changeNum) ? "—" : changeNum.toFixed(2)}%
        </p>
      </div>

      {/* Trend arrow */}
      <div
        className={[
          "flex items-center justify-center h-12 w-12 rounded-full",
          isPositive ? "bg-green-900/40" : "bg-red-900/40",
        ].join(" ")}
      >
        {isPositive ? (
          <svg
            className="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
