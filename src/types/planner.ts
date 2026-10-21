export type Metric = {
  label: string;
  value: string;
  detail: string;
};

export type ScheduleOperation = {
  id: string;
  operation: string;
  start: number;
  duration: number;
  state: "focus" | "scheduled" | "warning";
};

export type MachineLane = {
  id: string;
  name: string;
  operations: ScheduleOperation[];
};

export type PlannerAlert = {
  id: string;
  title: string;
  detail: string;
  state: "warning" | "neutral";
  label: string;
};

export type PlannerOverview = {
  dateLabel: string;
  horizonLabel: string;
  metrics: Metric[];
  machines: MachineLane[];
  alerts: PlannerAlert[];
};