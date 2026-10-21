"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { TextField } from "@/components/ui/text-field";
import { addProductionOrder, getProductionOrders, getProducts } from "@/services/mock-orders-service";
import type { NewProductionOrder, OrderPriority, ProductRouting } from "@/types/orders";

type FormValues = {
  id: string;
  productId: string;
  quantity: string;
  dueAt: string;
  priority: OrderPriority | "";
  planningScope: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const products = getProducts();
const initialValues: FormValues = { id: "", productId: "", quantity: "", dueAt: "", priority: "", planningScope: "current" };

function validate(values: FormValues, selectedProduct: ProductRouting | undefined): FieldErrors {
  const errors: FieldErrors = {};
  if (!/^PO-\d{3,}$/.test(values.id.trim().toUpperCase())) errors.id = "Use an order reference such as PO-112.";
  if (!values.productId || !selectedProduct) errors.productId = "Choose a product with an available routing.";
  const quantity = Number(values.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) errors.quantity = "Enter a whole quantity greater than zero.";
  if (!values.dueAt) errors.dueAt = "Choose a due date and time.";
  else if (values.dueAt < "2026-10-20T00:00") errors.dueAt = "Due date must be within the planning horizon or later.";
  if (!values.priority) errors.priority = "Choose an order priority.";
  if (!values.planningScope) errors.planningScope = "Choose a planning scope.";
  return errors;
}

export function NewOrderForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState("");

  function updateValue<Key extends keyof FormValues>(key: Key, value: FormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServiceError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const product = products.find((item) => item.productId === values.productId);
    const nextErrors = validate(values, product);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !product || !values.priority) return;

    setSubmitting(true);
    setServiceError("");
    try {
      const orders = await getProductionOrders();
      const normalizedId = values.id.trim().toUpperCase();
      if (orders.some((order) => order.id === normalizedId)) {
        setErrors({ id: "That order reference already exists." });
        return;
      }
      const order: NewProductionOrder = {
        id: normalizedId,
        productId: product.productId,
        productName: product.productName,
        routingId: product.routingId,
        quantity: Number(values.quantity),
        dueAt: values.dueAt,
        priority: values.priority,
      };
      const created = await addProductionOrder(order);
      setCreatedOrderId(created.id);
    } catch {
      setServiceError("The demo order could not be saved to this browser. Check storage permissions and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedProduct = products.find((product) => product.productId === values.productId);

  return (
    <>
      <div className="page-heading orders-heading">
        <div>
          <p className="eyebrow">ORDERS &amp; PRODUCTS <span>·</span> NEW ORDER</p>
          <h1>Create production order</h1>
          <p className="page-heading__subline">Add demand with an existing routing. Validate before it enters a planning view.</p>
        </div>
        <span className="mock-data-label">DEMO WORKSPACE</span>
      </div>

      <form className="new-order-form" onSubmit={handleSubmit} noValidate>
        <Card className="form-card">
          <div className="section-heading">
            <div><p className="eyebrow">ORDER SETUP</p><h2>Order details</h2></div>
            <span className="form-step">01 <i /> 02</span>
          </div>
          <div className="form-grid">
            <TextField autoComplete="off" error={errors.id} label="Order reference" name="order-reference" onChange={(event) => updateValue("id", event.target.value)} placeholder="PO-112" value={values.id} />
            <SelectField error={errors.productId} label="Product / routing" name="product" onChange={(event) => updateValue("productId", event.target.value)} value={values.productId}>
              <option value="">Select product and routing</option>
              {products.map((product) => <option key={product.productId} value={product.productId}>{product.productName} · {product.routingId}</option>)}
            </SelectField>
            <TextField error={errors.quantity} label="Quantity" min={1} name="quantity" onChange={(event) => updateValue("quantity", event.target.value)} placeholder="e.g. 100" type="number" value={values.quantity} />
            <TextField error={errors.dueAt} label="Due date" min="2026-10-20T00:00" name="due-at" onChange={(event) => updateValue("dueAt", event.target.value)} type="datetime-local" value={values.dueAt} />
            <SelectField error={errors.priority} label="Priority" name="priority" onChange={(event) => updateValue("priority", event.target.value as FormValues["priority"])} value={values.priority}>
              <option value="">Select priority</option>
              <option value="High">High</option><option value="Normal">Normal</option><option value="Low">Low</option>
            </SelectField>
            <SelectField error={errors.planningScope} label="Planning scope" name="planning-scope" onChange={(event) => updateValue("planningScope", event.target.value)} value={values.planningScope}>
              <option value="current">20–24 Oct 2026 · Current horizon</option>
              <option value="next">25–31 Oct 2026 · Next horizon</option>
            </SelectField>
          </div>
        </Card>

        <Card className="routing-check-card">
          <div className="section-heading">
            <div><p className="eyebrow">ROUTING CHECK</p><h2>{selectedProduct ? selectedProduct.productName : "Select a product"}</h2></div>
            {selectedProduct && <StatusBadge kind="published">Routing available</StatusBadge>}
          </div>
          {selectedProduct ? (
            <div className="routing-summary-grid">
              <div><span>Operations</span><strong>{selectedProduct.operations.length} sequential steps</strong></div>
              <div><span>Routing status</span><strong>Complete</strong></div>
              <div><span>Eligible machines</span><strong>{new Set(selectedProduct.operations.map((operation) => operation.resource)).size} resources</strong></div>
            </div>
          ) : (
            <p className="routing-placeholder">Choose a product to confirm its routing before saving.</p>
          )}
        </Card>

        <div className="prototype-note">
          <span className="prototype-note__icon" aria-hidden="true">i</span>
          <div><strong>Illustrative quantity policy</strong><p>Sample batch quantities and routing durations are mock data. Saving this form performs simulated validation only; no schedule is generated.</p></div>
        </div>

        {serviceError && <div className="form-error-banner" role="alert"><span>{serviceError}</span><button type="button" onClick={() => setServiceError("")}>Dismiss</button></div>}

        <div className="form-actions">
          <Button disabled={submitting} type="submit">{submitting ? "Validating order…" : "Save & validate order"}</Button>
          <Link className="button button--secondary" href="/planner/orders">Cancel</Link>
        </div>
      </form>

      {createdOrderId && (
        <div className="dialog-backdrop">
          <section aria-labelledby="order-created-title" aria-modal="true" className="result-dialog" role="dialog">
            <span className="dialog-check" aria-hidden="true">✓</span>
            <p className="eyebrow">MOCK SERVICE RESULT</p>
            <h2 id="order-created-title">Order added to the demo workspace</h2>
            <p><strong>{createdOrderId}</strong> passed simulated field and routing validation.</p>
            <div className="simulated-result"><StatusBadge kind="candidate">SIMULATED · READY FOR PLANNING</StatusBadge><span>No optimizer or production schedule was run.</span></div>
            <div className="dialog-actions">
              <Button onClick={() => router.push("/planner/orders")} type="button">View production orders</Button>
              <button className="button button--secondary" onClick={() => { setCreatedOrderId(""); setValues(initialValues); }} type="button">Create another</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}