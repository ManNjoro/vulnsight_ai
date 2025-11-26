import { Box, Skeleton, Typography } from "@mui/material";
import type { DashboardSummary } from "../types/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { COLORS } from "../utils/constants";
import { renderPieLabel } from "./RenderPieLabel";
import { RiskDistributionTooltip } from "./RiskDistributionTooltip";

export const RiskDistributionChart: React.FC<{
  data: DashboardSummary | undefined;
  loading: boolean;
}> = ({ data, loading }) => {
  if (loading || !data) return <Skeleton variant="rectangular" height={300} />;

  const chartData = data.risk_distribution;
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = chartData.map((d) => ({ ...d, __total__: total }));

  return (
    <Box sx={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={70}
            label={renderPieLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name.toLowerCase().includes("high")
                    ? COLORS.highRisk
                    : entry.name.toLowerCase().includes("medium")
                    ? COLORS.mediumRisk
                    : COLORS.lowRisk
                }
              />
            ))}
          </Pie>
          <Tooltip content={<RiskDistributionTooltip total={total} />} />
        </PieChart>
      </ResponsiveContainer>

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {total.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total Predictions
        </Typography>
      </Box>
    </Box>
  );
};