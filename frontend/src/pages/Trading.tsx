import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderHistory, createOrder, cancelOrder, CreateOrderPayload } from "../api/orders";
import { getSymbols } from "../api/markets";
import OrderForm from "../components/OrderForm";
import OrderTable from "../components/OrderTable";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
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

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-green-800 bg-green-900/20 px-4 py-3 text-sm text-green-400">
      {message}
    </div>
  );
}

export default function Trading() {
  const queryClient = useQueryClient();
  const [filterSymbol, setFilterSymbol] = useState("");
  const [historySymbol, setHistorySymbol] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<number | undefined>(undefined);

  const {
    data: symbols,
    isLoading: symbolsLoading,
    error: symbolsError,
  } = useQuery({
    queryKey: ["symbols"],
    queryFn: getSymbols,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders", filterSymbol || null],
    queryFn: () => getOrders(filterSymbol.trim().toUpperCase() || undefined),
  });

  const {
    data: orderHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["orders/history", historySymbol],
    queryFn: () => getOrderHistory(historySymbol.trim().toUpperCase()),
    enabled: historySymbol.trim().length > 0,
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setSuccessMsg(
        `Order #${data.orderId} placed: ${data.side} ${data.origQty} ${data.symbol} @ ${
          parseFloat(data.price) > 0 ? data.price : "market"
        }`
      );
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders/history"] });
      setTimeout(() => setSuccessMsg(null), 5000);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ orderId, symbol }: { orderId: number; symbol: string }) =>
      cancelOrder(orderId, symbol),
    onSuccess: (data) => {
      setCancelingId(undefined);
      setSuccessMsg(`Order #${data.orderId} canceled.`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: () => {
      setCancelingId(undefined);
    },
  });

  function handleSubmit(payload: CreateOrderPayload) {
    setSuccessMsg(null);
    createMutation.reset();
    createMutation.mutate(payload);
  }

  function handleCancel(orderId: number, symbol: string) {
    setCancelingId(orderId);
    cancelMutation.mutate({ orderId, symbol });
  }

  const openOrders = orders ?? [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Trading</h1>
        <p className="text-sm text-gray-500 mt-1">
          Place and manage spot orders
        </p>
      </div>

      {/* Notifications */}
      {successMsg && <SuccessBanner message={successMsg} />}
      {createMutation.isError && (
        <ErrorBanner message={(createMutation.error as Error).message} />
      )}
      {cancelMutation.isError && (
        <ErrorBanner message={(cancelMutation.error as Error).message} />
      )}

      {/* Order Form */}
      <div className="max-w-md">
        {symbolsLoading && <Spinner />}
        {symbolsError && (
          <ErrorBanner message={`Failed to load symbols: ${(symbolsError as Error).message}`} />
        )}
        {!symbolsLoading && (
          <OrderForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            symbols={symbols}
          />
        )}
      </div>

      {/* Open Orders */}
      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Open Orders
            {openOrders.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-brand-500/15 px-2 py-0.5 text-xs font-medium text-brand-400">
                {openOrders.length}
              </span>
            )}
          </h2>
          <input
            className="input w-40 text-sm"
            placeholder="Filter by symbol"
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value)}
          />
        </div>

        {ordersLoading && <Spinner />}
        {ordersError && (
          <ErrorBanner message={(ordersError as Error).message} />
        )}
        {orders && (
          <OrderTable
            orders={openOrders}
            onCancel={handleCancel}
            isCanceling={cancelMutation.isPending}
            cancelingId={cancelingId}
          />
        )}
      </section>

      {/* Order History */}
      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Order History
          </h2>
          <input
            className="input w-40 text-sm"
            placeholder="Symbol (e.g. DOGEUSDT)"
            value={historySymbol}
            onChange={(e) => setHistorySymbol(e.target.value)}
          />
        </div>
        {historySymbol.trim().length === 0 && (
          <p className="text-sm text-gray-500">Enter a symbol above to load history.</p>
        )}
        {historyLoading && <Spinner />}
        {historyError && (
          <ErrorBanner message={(historyError as Error).message} />
        )}
        {orderHistory && (
          <OrderTable
            orders={orderHistory}
            onCancel={handleCancel}
            isCanceling={cancelMutation.isPending}
            cancelingId={cancelingId}
          />
        )}
      </section>
    </div>
  );
}
