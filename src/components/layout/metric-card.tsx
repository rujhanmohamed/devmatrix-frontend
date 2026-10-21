import type { Metric } from "@/types/planner";
import { Card } from "@/components/ui/card";

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card className="metric-card" as="article">
      <p className="metric-card__label">{metric.label}</p>
      <strong className="metric-card__value">{metric.value}</strong>
      <p className="metric-card__detail">{metric.detail}</p>
    </Card>
  );
}