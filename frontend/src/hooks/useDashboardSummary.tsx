import { useQuery } from "@tanstack/react-query";
import type { DashboardSummary } from "../types/types";
import vulnerabilityApi from "../api/vulnerability";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await vulnerabilityApi.getDashboardSummary();
      return response.data;
    },
  });
};