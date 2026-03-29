interface BalanceCardProps {
  asset: string;
  free: string;
  locked: string;
  usd_value: number | null;
}

function formatAmount(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num === 0) return "0";
  if (num < 0.0001) return num.toExponential(4);
  if (num < 1) return num.toFixed(6);
  if (num < 1_000) return num.toFixed(4);
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function formatUSD(value: number): string {
  if (value >= 1_000_000)
    return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${value.toFixed(2)}`;
}

export default function BalanceCard({ asset, free, locked, usd_value }: BalanceCardProps) {
  const freeNum = parseFloat(free);
  const lockedNum = parseFloat(locked);
  const total = freeNum + lockedNum;
  const hasLocked = lockedNum > 0;

  return (
    <div className="card flex flex-col gap-3">
      {/* Asset name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/15 text-brand-400 text-xs font-bold">
            {asset.slice(0, 3)}
          </div>
          <span className="font-semibold text-gray-100">{asset}</span>
        </div>
        {hasLocked && (
          <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
            Locked
          </span>
        )}
      </div>

      {/* Total */}
      <div>
        <p className="text-xs text-gray-500 mb-0.5">Total</p>
        <p className="text-xl font-bold text-gray-100">{formatAmount(String(total))}</p>
        {usd_value != null ? (
          <p className="text-sm text-brand-400 font-mono mt-0.5">{formatUSD(usd_value)}</p>
        ) : (
          <p className="text-xs text-gray-600 mt-0.5">No price data</p>
        )}
      </div>

      {/* Free / Locked breakdown */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Available</p>
          <p className="text-sm font-medium text-green-400">{formatAmount(free)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">In Orders</p>
          <p className="text-sm font-medium text-amber-400">{formatAmount(locked)}</p>
        </div>
      </div>
    </div>
  );
}