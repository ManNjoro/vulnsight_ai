import type { TooltipProps } from "recharts";

export interface PredictionResult {
  id: number;
  cve_id: string;
  prediction: number;
  risk_probability: number;
  uploaded_at: string;
  original_filename: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DropDownOptions {
  label: string;
  value: string;
}

export interface SelectProps {
  options: DropDownOptions[];
  label: string;
  helperText: string;
  value: string;
  onChange: (val: string) => void;
}

export interface RiskDistributionItem {
  name: string;
  value: number;
}

export interface PredictionTimeData {
  date: string;
  count: number;
}

export interface DashboardSummary {
  total_predictions: number;
  high_risk: number;
  low_risk: number;
  latest_upload: string | null;
  risk_distribution: RiskDistributionItem[];
  predictions_over_time: PredictionTimeData[];
}
export type TimeTooltipProps = TooltipProps<number, string> & {
  payload?: { value?: number }[];
  label?: string;
};
export interface PieEntry {
  name?: string;
  value?: number;
  __total__?: number;
}
export type RDTooltipPayloadItem = {
  payload?: RiskDistributionItem;
  value?: number;
};
export type RDTooltipProps = TooltipProps<number, string> & {
  payload?: RDTooltipPayloadItem[];
  label?: string;
};
