import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PlannerShell } from "@/components/layout/planner-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { getProductRouting, getProductionOrders, getProducts } from "@/services/mock-orders-service";

export function generateStaticParams() {
  return getProducts().map((product) => ({ productId: product.productId }));
}

function formatTotalDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

export default function ProductRoutingPage({ params }: { params: Promise<{ productId: string }> }) {
  return (
    <PlannerShell>
      <Suspense fallback={<div className="route-loading" role="status"><span className="loading-indicator" /> Loading product routing…</div>}>
        <ProductRoutingContent params={params} />
      </Suspense>
    </PlannerShell>
  );
}

async function ProductRoutingContent({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const routing = getProductRouting(productId);
  if (!routing) notFound();

  const orders = await getProductionOrders();
  const linkedOrders = orders.filter((order) => order.productId === routing.productId);
  const latestOrder = linkedOrders[0];
  const totalDuration = routing.operations.reduce((total, operation) => total + operation.durationMinutes, 0);

  return (
    <div className="routing-workspace">
        <div className="page-heading orders-heading">
          <div>
            <p className="eyebrow"><Link href="/planner/orders">ORDERS &amp; PRODUCTS</Link> <span>·</span> ROUTING DETAIL</p>
            <h1>{routing.productName} <span className="title-divider">·</span> routing {routing.routingId}</h1>
            <p className="page-heading__subline">Product {routing.productCode} <span>·</span> Version {routing.version} <span>·</span> Illustrative sample data</p>
          </div>
          <span className="mock-data-label">DEMO ROUTING</span>
        </div>

        <div className="routing-actions">
          <Link className="button button--secondary" href="/planner/orders"><span aria-hidden="true">←</span> Back to orders</Link>
          <span className="routing-action-note">Read-only reference for this implementation stage</span>
        </div>

        <Card className="routing-table-card">
          <div className="routing-table-heading">
            <div><p className="eyebrow">PRODUCT ROUTING · {routing.routingId}</p><h2>Operation sequence</h2></div>
            <StatusBadge kind="published">COMPLETE · {routing.operations.length} STEPS</StatusBadge>
          </div>
          <div className="table-scroll" role="region" aria-label="Routing operation sequence" tabIndex={0}>
            <table className="data-table routing-table">
              <thead><tr><th scope="col">STEP / ID</th><th scope="col">OPERATION</th><th scope="col">DURATION¹</th><th scope="col">ELIGIBLE RESOURCE</th><th scope="col">PREDECESSOR</th></tr></thead>
              <tbody>
                {routing.operations.map((operation) => (
                  <tr key={operation.id}>
                    <td><span className="step-number">{String(operation.step).padStart(2, "0")}</span><span className="operation-id">{operation.id}</span></td>
                    <td className="routing-operation-name">{operation.operation}</td>
                    <td>{operation.durationMinutes} min</td>
                    <td><span className="resource-cell"><i aria-hidden="true" />{operation.resource}</span></td>
                    <td>{operation.predecessor ?? <span className="no-predecessor">None <span>· first operation</span></span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="routing-total"><span>Total modelled processing time</span><strong>{formatTotalDuration(totalDuration)}</strong></div>
          <p className="table-footnote">¹ Sample duration per modelled batch. Final quantity-duration rules require factory confirmation.</p>
        </Card>

        <Card className="routing-ready-card">
          <span className="routing-ready-icon" aria-hidden="true">✓</span>
          <div><p className="eyebrow">ROUTING VALIDATION</p><h2>Routing ready for planning</h2><p>All steps have a positive duration, an eligible resource and a valid predecessor sequence.</p></div>
          <StatusBadge kind="published">READY</StatusBadge>
        </Card>

        <Card className="order-context-card">
          <div className="section-heading"><div><p className="eyebrow">RELATED DEMAND</p><h2>Order context</h2></div><span className="related-count">{linkedOrders.length} linked</span></div>
          {latestOrder ? (
            <div className="order-context-grid">
              <div><span>Order</span><strong><Link href="/planner/orders">{latestOrder.id} · {latestOrder.quantity} units</Link></strong></div>
              <div><span>Deadline</span><strong><time dateTime={latestOrder.dueAt}>{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" }).format(new Date(latestOrder.dueAt))}</time></strong></div>
              <div><span>Priority</span><strong>{latestOrder.priority}</strong></div>
            </div>
          ) : (
            <div className="routing-empty"><p>No production orders currently use this routing.</p><Link className="button button--secondary" href="/planner/orders/new">Create an order</Link></div>
          )}
        </Card>

        <p className="routing-disclaimer"><span aria-hidden="true">i</span> Routing checks are simulated from local sample data. No optimizer or production schedule has been run.</p>
    </div>
  );
}