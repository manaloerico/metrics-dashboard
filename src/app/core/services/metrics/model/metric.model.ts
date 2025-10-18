export interface Metric {
  type: string;
  _id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  entries: { date: string; value: number }[];
}
