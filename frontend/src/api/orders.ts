import apiClient from "./client";

export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";
export type OrderStatus =
  | "NEW"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELED"
  | "REJECTED"
  | "EXPIRED";

export interface Order {
  orderId: number;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: string;
  origQty: string;
  executedQty: string;
  status: OrderStatus;
  timeInForce: string;
  time: number;
  updateTime: number;
}

export interface CreateOrderPayload {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  timeInForce?: string;
}

export interface CreateOrderResponse {
  orderId: number;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  price: string;
  origQty: string;
  transactTime: number;
}

export interface CancelOrderResponse {
  orderId: number;
  symbol: string;
  status: string;
}

export async function getOrders(symbol?: string): Promise<Order[]> {
  const params = symbol ? { symbol } : {};
  const { data } = await apiClient.get<Order[]>("/orders", { params });
  return data;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const { data } = await apiClient.post<CreateOrderResponse>("/orders", payload);
  return data;
}

export async function cancelOrder(
  orderId: number,
  symbol: string
): Promise<CancelOrderResponse> {
  const { data } = await apiClient.delete<CancelOrderResponse>(
    `/orders/${orderId}`,
    { params: { symbol } }
  );
  return data;
}
