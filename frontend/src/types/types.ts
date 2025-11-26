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
