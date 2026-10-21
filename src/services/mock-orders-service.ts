import type { NewProductionOrder, ProductRouting, ProductionOrder } from "@/types/orders";

const storageKey = "devmatrix.mock.production-orders.v1";

const seedOrders: ProductionOrder[] = [
  { id: "PO-104", productId: "P-010", productName: "Oak table", routingId: "R-04", quantity: 100, dueAt: "2026-10-20T16:00", priority: "High", state: "Ready" },
  { id: "PO-105", productId: "P-014", productName: "Dining chair", routingId: "R-02", quantity: 100, dueAt: "2026-10-22T16:00", priority: "Normal", state: "Ready" },
  { id: "PO-106", productId: "P-021", productName: "Side cabinet", routingId: "R-07", quantity: 100, dueAt: "2026-10-24T12:00", priority: "High", state: "In planning" },
  { id: "PO-107", productId: "P-006", productName: "Desk", routingId: "R-03", quantity: 100, dueAt: "2026-10-24T16:00", priority: "Normal", state: "Ready" },
  { id: "PO-108", productId: "P-010", productName: "Oak table", routingId: "R-04", quantity: 80, dueAt: "2026-10-25T12:00", priority: "Low", state: "Ready" },
  { id: "PO-109", productId: "P-014", productName: "Dining chair", routingId: "R-02", quantity: 120, dueAt: "2026-10-26T16:00", priority: "Normal", state: "Scheduled" },
  { id: "PO-110", productId: "P-021", productName: "Side cabinet", routingId: "R-07", quantity: 60, dueAt: "2026-10-27T12:00", priority: "High", state: "Ready" },
  { id: "PO-111", productId: "P-006", productName: "Desk", routingId: "R-03", quantity: 80, dueAt: "2026-10-28T16:00", priority: "Low", state: "In planning" },
];

export const productRoutings: ProductRouting[] = [
  {
    productId: "P-010",
    productName: "Oak table",
    productCode: "P-010",
    routingId: "R-04",
    version: 3,
    operations: [
      { id: "OP-15", step: 1, operation: "Cutting", durationMinutes: 120, resource: "CUT-01 · Panel saw", predecessor: null },
      { id: "OP-16", step: 2, operation: "Assembly", durationMinutes: 180, resource: "ASM-01 · Assembly", predecessor: "OP-15" },
      { id: "OP-17", step: 3, operation: "Sanding", durationMinutes: 90, resource: "SND-01 · Sander", predecessor: "OP-16" },
      { id: "OP-18", step: 4, operation: "Finishing", durationMinutes: 120, resource: "FIN-01 · Finishing", predecessor: "OP-17" },
    ],
  },
  {
    productId: "P-014",
    productName: "Dining chair",
    productCode: "P-014",
    routingId: "R-02",
    version: 2,
    operations: [
      { id: "OP-21", step: 1, operation: "Cutting", durationMinutes: 90, resource: "CUT-01 · Panel saw", predecessor: null },
      { id: "OP-22", step: 2, operation: "Assembly", durationMinutes: 150, resource: "ASM-01 · Assembly", predecessor: "OP-21" },
      { id: "OP-23", step: 3, operation: "Sanding", durationMinutes: 75, resource: "SND-01 · Sander", predecessor: "OP-22" },
      { id: "OP-24", step: 4, operation: "Finishing", durationMinutes: 90, resource: "FIN-01 · Finishing", predecessor: "OP-23" },
    ],
  },
  {
    productId: "P-021",
    productName: "Side cabinet",
    productCode: "P-021",
    routingId: "R-07",
    version: 1,
    operations: [
      { id: "OP-31", step: 1, operation: "Cutting", durationMinutes: 105, resource: "CUT-01 · Panel saw", predecessor: null },
      { id: "OP-32", step: 2, operation: "Assembly", durationMinutes: 165, resource: "ASM-01 · Assembly", predecessor: "OP-31" },
      { id: "OP-33", step: 3, operation: "Sanding", durationMinutes: 90, resource: "SND-01 · Sander", predecessor: "OP-32" },
      { id: "OP-34", step: 4, operation: "Finishing", durationMinutes: 120, resource: "FIN-01 · Finishing", predecessor: "OP-33" },
    ],
  },
  {
    productId: "P-006",
    productName: "Desk",
    productCode: "P-006",
    routingId: "R-03",
    version: 2,
    operations: [
      { id: "OP-41", step: 1, operation: "Cutting", durationMinutes: 110, resource: "CUT-01 · Panel saw", predecessor: null },
      { id: "OP-42", step: 2, operation: "Assembly", durationMinutes: 150, resource: "ASM-01 · Assembly", predecessor: "OP-41" },
      { id: "OP-43", step: 3, operation: "Sanding", durationMinutes: 90, resource: "SND-01 · Sander", predecessor: "OP-42" },
      { id: "OP-44", step: 4, operation: "Finishing", durationMinutes: 105, resource: "FIN-01 · Finishing", predecessor: "OP-43" },
    ],
  },
];

function readStoredOrders(): ProductionOrder[] {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return [];
  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed)) throw new Error("Saved demo orders are unreadable.");
  return parsed as ProductionOrder[];
}

export async function getProductionOrders(): Promise<ProductionOrder[]> {
  const storedOrders = readStoredOrders();
  return [...storedOrders, ...seedOrders];
}

export async function addProductionOrder(order: NewProductionOrder): Promise<ProductionOrder> {
  await new Promise((resolve) => setTimeout(resolve, 220));
  const storedOrders = readStoredOrders();
  const duplicate = [...storedOrders, ...seedOrders].some((existing) => existing.id === order.id);
  if (duplicate) throw new Error("That order reference already exists.");
  const created: ProductionOrder = { ...order, state: "Ready" };
  window.localStorage.setItem(storageKey, JSON.stringify([created, ...storedOrders]));
  return created;
}

export function getProductRouting(productId: string): ProductRouting | undefined {
  return productRoutings.find((routing) => routing.productId === productId);
}

export function getProductByRoutingId(routingId: string): ProductRouting | undefined {
  return productRoutings.find((routing) => routing.routingId === routingId);
}

export function getProducts(): ProductRouting[] {
  return productRoutings;
}