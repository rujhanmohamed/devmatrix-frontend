import type { PlannerOverview } from "@/types/planner";

const overview: PlannerOverview = {
  dateLabel: "Tuesday, 20 October",
  horizonLabel: "Planning horizon: 20–24 Oct 2026",
  metrics: [
    { label: "Open production orders", value: "8 orders", detail: "800 units · horizon total" },
    { label: "Ready for planning", value: "8 / 8", detail: "Validated orders · snapshot 042" },
    { label: "On-time completion", value: "75%", detail: "Projected · published v11" },
    { label: "Exceptions to review", value: "2 open", detail: "Reported observations · today" },
  ],
  machines: [
    {
      id: "cut-01",
      name: "CUT-01 · Panel saw",
      operations: [
        { id: "104-cut", operation: "104 / Cut", start: 0, duration: 2, state: "focus" },
        { id: "105-cut", operation: "105 / Cut", start: 2, duration: 1.5, state: "scheduled" },
        { id: "106-cut", operation: "106 / Cut", start: 4, duration: 2, state: "scheduled" },
      ],
    },
    {
      id: "asm-01",
      name: "ASM-01 · Assembly",
      operations: [
        { id: "103-assemble", operation: "103 / Assemble", start: 0, duration: 2, state: "scheduled" },
        { id: "104-assemble", operation: "104 / Assemble", start: 2, duration: 3, state: "focus" },
        { id: "105-assemble", operation: "105 / Assemble", start: 5, duration: 2, state: "scheduled" },
      ],
    },
    {
      id: "snd-01",
      name: "SND-01 · Sanding",
      operations: [
        { id: "103-sand", operation: "103 / Sand", start: 0, duration: 1.5, state: "scheduled" },
        { id: "104-sand", operation: "104 / Sand", start: 5, duration: 1.5, state: "focus" },
        { id: "105-sand", operation: "105 / Sand", start: 7, duration: 1, state: "scheduled" },
      ],
    },
    {
      id: "fin-01",
      name: "FIN-01 · Finishing",
      operations: [
        { id: "maintenance", operation: "Maintenance", start: 0, duration: 2, state: "warning" },
        { id: "103-finish", operation: "103 / Finish", start: 2, duration: 2.5, state: "scheduled" },
        { id: "104-finish", operation: "104 / Finish", start: 6.5, duration: 2, state: "warning" },
      ],
    },
  ],
  alerts: [
    {
      id: "EX-026",
      title: "Material shortage reported",
      detail: "EX-026 · Task OP-11 · Supervisor · 08:40",
      state: "warning",
      label: "Open",
    },
    {
      id: "R-042",
      title: "Candidate v12 is ready to review",
      detail: "Run R-042 · feasible, optimality not proven",
      state: "neutral",
      label: "Ready",
    },
  ],
};

export async function getPlannerOverview(): Promise<PlannerOverview> {
  return overview;
}