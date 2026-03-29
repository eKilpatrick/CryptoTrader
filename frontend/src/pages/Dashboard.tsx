import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../api/account";
import { getBalances } from "../api/account";
import { getOrders } from "../api/orders";
import BalanceCard from "../components/BalanceCard";
import OrderTable from "../components/OrderTable";

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

function InfoRow({ label, value }: { label: string; value: string | boolean }) {
  const display =
    typeof value === "boolean" ? (
      <span
        className={
          value
            ? "text-green-400 font-medium"
            : "text-red-400 font-medium"
        }
      >
        {value ? "Yes" : "No"}
      </span>
    ) : (
      <span className="text-gray-200 font-medium">{value}</span>
    );

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm">{display}</span>
    </div>
  );
}

export default function Dashboard() {
  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useQuery({
    queryKey: ["account"],
    queryFn: getAccount,
  });

  const {
    data: balances,
    isLoading: balancesLoading,
    error: balancesError,
  } = useQuery({
    queryKey: ["balances"],
    queryFn: getBalances,
  });

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  // Only show balances with a non-zero total
  const activeBalances = (balances ?? []).filter(
    (b) => parseFloat(b.free) + parseFloat(b.locked) > 0
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Account overview and recent activity
        </p>
      </div>

      {/* Account Info */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Account Info
        </h2>
        {accountLoading && <Spinner />}
        {accountError && (
          <ErrorBanner message={(accountError as Error).message} />
        )}
        {account && (
          <div className="card max-w-sm">
            <InfoRow label="Account Type" value={account.accountType} />
            <InfoRow label="Can Trade" value={account.canTrade} />
            <InfoRow label="Can Withdraw" value={account.canWithdraw} />
            <InfoRow label="Can Deposit" value={account.canDeposit} />
            <InfoRow
              label="Maker Commission"
              value={`${account.makerCommission / 100}%`}
            />
            <InfoRow
              label="Taker Commission"
              value={`${account.takerCommission / 100}%`}
            />
          </div>
        )}
      </section>

      {/* Balances */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Balances
        </h2>
        {balancesLoading && <Spinner />}
        {balancesError && (
          <ErrorBanner message={(balancesError as Error).message} />
        )}
        {balances && activeBalances.length === 0 && (
          <p className="text-sm text-gray-500">No non-zero balances found.</p>
        )}
        {balances && activeBalances.length > 0 && (
          <>
            {/* Portfolio total */}
            {(() => {
              const total = activeBalances.reduce(
                (sum, b) => (b.usd_value != null ? sum + b.usd_value : sum),
                0
              );
              const hasAnyPrice = activeBalances.some((b) => b.usd_value != null);
              return hasAnyPrice ? (
                <div className="card max-w-xs mb-4">
                  <p className="text-xs text-gray-500 mb-1">Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-100 font-mono">
                    {total >= 1_000_000
                      ? `$${(total / 1_000_000).toFixed(2)}M`
                      : `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
              ) : null;
            })()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeBalances.map((b) => (
                <BalanceCard
                  key={b.asset}
                  asset={b.asset}
                  free={b.free}
                  locked={b.locked}
                  usd_value={b.usd_value}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Recent Orders */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Recent Trades
        </h2>
        {ordersLoading && <Spinner />}
        {ordersError && (
          <ErrorBanner message={(ordersError as Error).message} />
        )}
        {orders && (
          <OrderTable
            orders={orders.slice(0, 20)}
            onCancel={() => {
              /* read-only on dashboard */
            }}
          />
        )}
      </section>
    </div>
  );
}
