import { Skeleton } from "@mui/material";
import type { DashboardSummary } from "../types/types";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS } from "../utils/constants";
import { PredictionsOverTimeTooltip } from "./PredictionsOverTimeTooltip";

export const PredictionsOverTimeChart: React.FC<{
  data: DashboardSummary | undefined;
  loading: boolean;
}> = ({ data, loading }) => {
  if (loading || !data) return <Skeleton variant="rectangular" height={300} />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data.predictions_over_time}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip content={<PredictionsOverTimeTooltip />} />
        <Area type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} fill="url(#colorCount)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};