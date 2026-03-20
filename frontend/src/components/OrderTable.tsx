import { Order, OrderStatus } from "../api/orders";

interface OrderTableProps {
  orders: Order[];
  onCancel: (orderId: number, symbol: string) => void;
  isCanceling?: boolean;
  cancelingId?: number;
}

function statusClass(status: OrderStatus): string {
  switch (status) {
    case "NEW":
      return "bg-blue-900 text-blue-300";
    case "PARTIALLY_FILLED":
      return "bg-amber-900 text-amber-300";
    case "FILLED":
      return "bg-green-900 text-green-300";
    case "CANCELED":
    case "EXPIRED":
    case "REJECTED":
      return "bg-gray-800 text-gray-500";
    default:
      return "bg-gray-800 text-gray-400";
  }
}

function formatPrice(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num) || num === 0) return "—";
  return num.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function formatTime(ms: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleString();
}

const cancelableStatuses: OrderStatus[] = ["NEW", "PARTIALLY_FILLED"];

export default function OrderTable({
  orders,
  onCancel,
  isCanceling = false,
  cancelingId,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="card text-center py-10">
        <p className="text-gray-500 text-sm">No orders found.</p>
      </div>
    );
  }

  function handleCancel(order: Order) {
    const confirmed = window.confirm(
      `Cancel order #${order.orderId} — ${order.side} ${order.origQty} ${order.symbol}?`
    );
    if (confirmed) {
      onCancel(order.orderId, order.symbol);
    }
  }

  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Side
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Filled
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {orders.map((order) => {
            const canCancel = cancelableStatuses.includes(order.status);
            const isThisCanceling = isCanceling && cancelingId === order.orderId;

            return (
              <tr
                key={order.orderId}
                className="hover:bg-gray-800/40 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-100">
                  {order.symbol}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      order.side === "BUY" ? "badge-buy" : "badge-sell"
                    }
                  >
                    {order.side}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{order.type}</td>
                <td className="px-4 py-3 text-right text-gray-300 font-mono">
                  {formatPrice(order.price)}
                </td>
                <td className="px-4 py-3 text-right text-gray-300 font-mono">
                  {formatPrice(order.origQty)}
                </td>
                <td className="px-4 py-3 text-right text-gray-300 font-mono">
                  {formatPrice(order.executedQty)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {formatTime(order.time)}
                </td>
                <td className="px-4 py-3 text-center">
                  {canCancel ? (
                    <button
                      onClick={() => handleCancel(order)}
                      disabled={isThisCanceling}
                      className="btn-danger px-2 py-1 text-xs"
                    >
                      {isThisCanceling ? "Canceling…" : "Cancel"}
                    </button>
                  ) : (
                    <span className="text-gray-700 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
