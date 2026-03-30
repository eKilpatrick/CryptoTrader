import { useState, FormEvent } from "react";
import { CreateOrderPayload, OrderSide, OrderType } from "../api/orders";
import { TradingSymbol } from "../api/markets";

interface OrderFormProps {
  onSubmit: (payload: CreateOrderPayload) => void;
  isLoading: boolean;
  symbols?: TradingSymbol[];
}

export default function OrderForm({ onSubmit, isLoading, symbols }: OrderFormProps) {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedSymbol = symbol.trim().toUpperCase();
    if (!trimmedSymbol) {
      setError("Symbol is required.");
      return;
    }

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    if (orderType === "LIMIT") {
      const px = parseFloat(price);
      if (!price || isNaN(px) || px <= 0) {
        setError("Price must be a positive number for limit orders.");
        return;
      }
    }

    const payload: CreateOrderPayload = {
      symbol: trimmedSymbol,
      side,
      type: orderType,
      quantity: qty,
      ...(orderType === "LIMIT" && {
        price: parseFloat(price),
        timeInForce: "GTC",
      }),
    };

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-base font-semibold text-gray-100">Place Order</h2>

      {/* Symbol */}
      <div>
        <label className="label" htmlFor="symbol">
          Symbol
        </label>
        {symbols && symbols.length > 0 ? (
          <select
            id="symbol"
            className="input"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          >
            {symbols.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.baseAsset} / {s.quoteAsset}
              </option>
            ))}
          </select>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap mb-2">
              {["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSymbol(s)}
                  className={[
                    "px-2.5 py-1 text-xs rounded-md font-medium transition-colors",
                    symbol === s
                      ? "bg-brand-500 text-gray-950"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              id="symbol"
              className="input uppercase"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. BTCUSDT"
              required
            />
          </>
        )}
      </div>

      {/* Order Type */}
      <div>
        <label className="label">Order Type</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(["MARKET", "LIMIT"] as OrderType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setOrderType(t)}
              className={[
                "flex-1 py-2 text-sm font-medium transition-colors",
                orderType === t
                  ? "bg-brand-500 text-gray-950"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Side */}
      <div>
        <label className="label">Side</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            type="button"
            onClick={() => setSide("BUY")}
            className={[
              "flex-1 py-2 text-sm font-medium transition-colors",
              side === "BUY"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100",
            ].join(" ")}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setSide("SELL")}
            className={[
              "flex-1 py-2 text-sm font-medium transition-colors",
              side === "SELL"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100",
            ].join(" ")}
          >
            SELL
          </button>
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="label" htmlFor="quantity">
          Quantity
        </label>
        <input
          id="quantity"
          className="input"
          type="number"
          min="0"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      {/* Price — only for LIMIT */}
      {orderType === "LIMIT" && (
        <div>
          <label className="label" htmlFor="price">
            Limit Price (USDT)
          </label>
          <input
            id="price"
            className="input"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={[
          "btn w-full py-2.5",
          side === "BUY"
            ? "bg-green-600 text-white hover:bg-green-500 focus:ring-green-500"
            : "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
        ].join(" ")}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
            Placing Order…
          </span>
        ) : (
          `${side} ${symbol || "—"}`
        )}
      </button>
    </form>
  );
}
