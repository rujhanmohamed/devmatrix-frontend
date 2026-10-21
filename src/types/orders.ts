export type ProductionOrderState = "Ready" | "In planning" | "Scheduled";
export type OrderPriority = "High" | "Normal" | "Low";

export type ProductionOrder = {
  id: string;
  productId: string;
  productName: string;
  routingId: string;
  quantity: number;
  dueAt: string;
  priority: OrderPriority;
  state: ProductionOrderState;
};

export type RoutingOperation = {
  id: string;
  step: number;
  operation: string;
  durationMinutes: number;
  resource: string;
  predecessor: string | null;
};

export type ProductRouting = {
  productId: string;
  productName: string;
  productCode: string;
  routingId: string;
  version: number;
  operations: RoutingOperation[];
};

export type NewProductionOrder = Omit<ProductionOrder, "state">;