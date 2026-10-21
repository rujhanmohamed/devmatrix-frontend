"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TextField } from "@/components/ui/text-field";
import { SelectField } from "@/components/ui/select-field";
import { getProductionOrders } from "@/services/mock-orders-service";
import type { ProductionOrder } from "@/types/orders";

type PeriodFilter = "all" | "this-week" | "next-week";
type StateFilter = "all" | ProductionOrder["state"];

function orderStatusKind(state: ProductionOrder["state"]) {
  if (state === "Scheduled") return "published" as const;
  if (state === "In planning") return "candidate" as const;
  return "neutral" as const;
}

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  }).format(new Date(value));
}

export function OrdersList() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [state, setState] = useState<StateFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      setOrders(await getProductionOrders());
    } catch {
      setError("We couldn’t load the demo orders. Check browser storage and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getProductionOrders()
      .then((result) => {
        if (active) setOrders(result);
      })
      .catch(() => {
        if (active) setError("We couldn’t load the demo orders. Check browser storage and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [order.id, order.productName, order.routingId].some((value) => value.toLowerCase().includes(query));
    const dueDay = new Date(order.dueAt).getDate();
    const matchesPeriod = period === "all" || (period === "this-week" ? dueDay <= 24 : dueDay > 24);
    const matchesState = state === "all" || order.state === state;
    return matchesSearch && matchesPeriod && matchesState;
  });

  return (
    <div className="orders-workspace">
      <div className="page-heading orders-heading">
        <div>
          <p className="eyebrow">PLANNER WORKSPACE <span>·</span> DEMAND</p>
          <h1>Orders &amp; products</h1>
          <p className="page-heading__subline">Keep demand, due dates and production routing ready for scheduling.</p>
        </div>
        <span className="mock-data-label">DEMO DATA</span>
      </div>

      <div className="orders-actions">
        <Link className="button button--primary" href="/planner/orders/new">＋ New production order</Link>
        <Link className="button button--secondary" href="/planner/products/P-010/routing">Product routings</Link>
      </div>

      <Card className="orders-filter-card">
        <div className="orders-filter-heading">
          <div>
            <p className="eyebrow">ORDER REGISTER</p>
            <h2>Find production orders</h2>
          </div>
          <span className="filter-hint">{loading ? "Loading…" : `${filteredOrders.length} shown / ${orders.length} total`}</span>
        </div>
        <div className="orders-filters">
          <TextField label="Search" name="order-search" onChange={(event) => setSearch(event.target.value)} placeholder="Order, product or routing" type="search" value={search} />
          <SelectField label="Planning period" name="period" onChange={(event) => setPeriod(event.target.value as PeriodFilter)} value={period}>
            <option value="all">All planning dates</option>
            <option value="this-week">20–24 Oct 2026</option>
            <option value="next-week">After 24 Oct 2026</option>
          </SelectField>
          <SelectField label="Order state" name="order-state" onChange={(event) => setState(event.target.value as StateFilter)} value={state}>
            <option value="all">All states</option>
            <option value="Ready">Ready</option>
            <option value="In planning">In planning</option>
            <option value="Scheduled">Scheduled</option>
          </SelectField>
        </div>
      </Card>

      <Card className="orders-table-card">
        <div className="orders-table-heading">
          <div>
            <p className="eyebrow">DEMAND OVERVIEW</p>
            <h2>Production orders <span>· {loading ? "…" : orders.length} total</span></h2>
          </div>
          <span className="snapshot-label">SNAPSHOT 042</span>
        </div>
        {loading ? (
          <div className="orders-loading" role="status" aria-live="polite">
            <span className="loading-indicator" /> Loading production orders…
          </div>
        ) : error ? (
          <div className="orders-error" role="alert">
            <p>{error}</p>
            <button className="button button--secondary" onClick={() => void loadOrders()} type="button">Try again</button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <span className="empty-mark" aria-hidden="true">⌕</span>
            <h3>No matching orders</h3>
            <p>Try changing the search or filters to see other production orders.</p>
            <button className="button button--secondary" onClick={() => { setSearch(""); setPeriod("all"); setState("all"); }} type="button">Clear filters</button>
          </div>
        ) : (
          <div className="table-scroll" role="region" aria-label="Production orders table" tabIndex={0}>
            <table className="data-table orders-table">
              <thead>
                <tr><th scope="col">ORDER</th><th scope="col">PRODUCT / ROUTING</th><th scope="col">QUANTITY</th><th scope="col">DUE DATE</th><th scope="col">PRIORITY</th><th scope="col">STATE</th></tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td><Link className="table-link" href={`/planner/products/${order.productId}/routing`}>{order.id}</Link></td>
                    <td><Link className="product-link" href={`/planner/products/${order.productId}/routing`}>{order.productName}<small>{order.routingId}</small></Link></td>
                    <td>{order.quantity} units</td>
                    <td><time dateTime={order.dueAt}>{formatDueDate(order.dueAt)}</time></td>
                    <td><span className={`priority-label priority-label--${order.priority.toLowerCase()}`}>{order.priority}</span></td>
                    <td><StatusBadge kind={orderStatusKind(order.state)}>{order.state}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && filteredOrders.length > 0 && <p className="table-footnote">Showing {filteredOrders.length} of {orders.length} orders · Select a product to inspect its routing.</p>}
      </Card>
    </div>
  );
}