import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/layout/metric-card";
import { PlannerShell } from "@/components/layout/planner-shell";
import { getPlannerOverview } from "@/services/mock-planner-service";

const hours = ["08:00", "10:00", "12:00", "14:00", "16:00"];

export default async function PlannerOverviewPage() {
  const data = await getPlannerOverview();

  return (
    <PlannerShell>
      <div className="overview-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PLANNER WORKSPACE <span>·</span> OVERVIEW</p>
            <h1>Every shift starts with a clear plan.</h1>
            <p className="page-heading__subline">{data.dateLabel} <span>·</span> {data.horizonLabel}</p>
          </div>
          <StatusBadge kind="published">LIVE PLAN · V11</StatusBadge>
        </div>

        <div className="overview-actions" aria-label="Overview shortcuts">
          <a className="button button--primary" href="#machine-allocation">Create schedule <span aria-hidden="true">↗</span></a>
          <a className="button button--secondary" href="#attention">Import planning data</a>
          <a className="button button--quiet" href="#machine-allocation">View published v11</a>
        </div>

        <section className="metric-grid" aria-label="Planning metrics">
          {data.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </section>

        <Card className="allocation-card" id="machine-allocation">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SHIFT ALLOCATION <span>·</span> TUESDAY</p>
              <h2>Today’s machine allocation</h2>
            </div>
            <span className="version-label">Published v11</span>
          </div>
          <div className="allocation-meta">
            <StatusBadge kind="published">v11 · Published</StatusBadge>
            <StatusBadge kind="neutral">Solver: Feasible</StatusBadge>
            <span className="allocation-meta__date">Tue 20 Oct 2026 <span>·</span> 08:00–17:00</span>
          </div>
          <div className="timeline-scroll" role="region" aria-label="Machine schedule timeline" tabIndex={0}>
            <div className="timeline">
              <div className="timeline__header">
                <span className="timeline__resource-heading">MACHINE / RESOURCE</span>
                <div className="timeline__hours">{hours.map((hour) => <span key={hour}>{hour}</span>)}</div>
              </div>
              {data.machines.map((machine) => (
                <div className="timeline__row" key={machine.id}>
                  <span className="timeline__resource">{machine.name}</span>
                  <div className="timeline__lane">
                    {hours.map((hour) => <span className="timeline__gridline" key={hour} aria-hidden="true" />)}
                    {machine.operations.map((operation) => (
                      <span
                        className={`timeline__operation timeline__operation--${operation.state}`}
                        key={operation.id}
                        style={{ left: `${(operation.start / 9) * 100}%`, width: `${(operation.duration / 9) * 100}%` }}
                        title={`${operation.operation}, ${String(8 + Math.floor(operation.start)).padStart(2, "0")}:${String(Math.round((operation.start % 1) * 60)).padStart(2, "0")}`}
                      >
                        {operation.operation}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="timeline-legend" aria-label="Timeline legend">
            <span><i className="legend-swatch legend-swatch--scheduled" /> Scheduled operation</span>
            <span><i className="legend-swatch legend-swatch--focus" /> Focus order</span>
            <span><i className="legend-swatch legend-swatch--warning" /> Attention required</span>
          </div>
        </Card>

        <Card className="attention-card" id="attention">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">EXCEPTIONS & RUNS</p>
              <h2>Needs your attention</h2>
            </div>
            <span className="attention-count">02</span>
          </div>
          <div className="attention-list">
            {data.alerts.map((alert) => (
              <article className="attention-item" key={alert.id}>
                <span className={`attention-item__marker attention-item__marker--${alert.state}`} aria-hidden="true" />
                <div className="attention-item__copy">
                  <h3>{alert.title}</h3>
                  <p>{alert.detail}</p>
                </div>
                <StatusBadge kind={alert.state}>{alert.label}</StatusBadge>
                <span className="attention-item__arrow" aria-hidden="true">→</span>
              </article>
            ))}
          </div>
        </Card>
        <footer className="overview-footer"><span>Production snapshot 042</span><span>Data refreshed 09:12 · Asia/Colombo</span></footer>
      </div>
    </PlannerShell>
  );
}