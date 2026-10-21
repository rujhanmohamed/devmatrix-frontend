import { PlannerShell } from "@/components/layout/planner-shell";
import { NewOrderForm } from "@/features/orders/new-order-form";

export default function NewOrderPage() {
  return (
    <PlannerShell>
      <div className="new-order-workspace"><NewOrderForm /></div>
    </PlannerShell>
  );
}