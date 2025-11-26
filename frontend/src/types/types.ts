
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

export interface DashboardSummary {
  total_predictions: number;
  high_risk: number;
  low_risk: number;
  latest_upload: string | null;
  risk_distribution: { name: string; value: number }[];
  predictions_over_time: { date: string; count: number }[];
}