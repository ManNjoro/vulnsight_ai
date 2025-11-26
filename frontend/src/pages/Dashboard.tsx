// src/pages/Dashboard.tsx
import React from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// type-only import required by strict TS config
import type { TooltipProps } from "recharts";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import {
  TrendingUp,
  Upload,
  Security,
  Warning,
} from "@mui/icons-material";
import type { DashboardSummary, RiskDistributionItem } from "../types/types";

const COLORS = {
  highRisk: "#ef4444",
  lowRisk: "#10b981",
  mediumRisk: "#f59e0b",
  primary: "#3b82f6",
  grid: "#f3f4f6",
} as const;

type RDTooltipPayloadItem = {
  payload?: RiskDistributionItem;
  value?: number;
};

type RDTooltipProps = TooltipProps<number, string> & {
  payload?: RDTooltipPayloadItem[]; // more specific than the Recharts base type
  label?: string;
};

type TimeTooltipProps = TooltipProps<number, string> & {
  payload?: { value?: number }[];
  label?: string;
};

interface PieEntry {
  name?: string;
  value?: number;
  __total__?: number; // custom injected total
}

/* -------------------------
   Risk Distribution Tooltip
   ------------------------- */
const RiskDistributionTooltip: React.FC<RDTooltipProps & { total: number }> = ({
  active,
  payload,
  total,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const itemPayload = payload[0].payload;
  const itemValue = payload[0].value ?? itemPayload?.value ?? 0;

  const percentage = total > 0 ? ((itemValue / total) * 100).toFixed(1) : "0.0";

  return (
    <Box sx={{ bgcolor: "white", p: 2, border: "1px solid #ddd", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="subtitle2" fontWeight="bold">
        {itemPayload?.name}
      </Typography>
      <Typography variant="body2">
        Count: <strong>{itemValue}</strong>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {percentage}% of total
      </Typography>
    </Box>
  );
};


/* -------------------------
   Predictions Over Time Tooltip
   ------------------------- */
const PredictionsOverTimeTooltip: React.FC<TimeTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0].value ?? 0;

  return (
    <Box sx={{ bgcolor: "white", p: 2, border: "1px solid #ddd", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="subtitle2" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body2" color={COLORS.primary}>
        Predictions: <strong>{value}</strong>
      </Typography>
    </Box>
  );
};

/* -------------------------
   Helper to render pie label (strongly typed)
   ------------------------- */
const renderPieLabel = (entry: PieEntry) => {
  // entry is the Pie entry — keep it flexible but typed locally
  const name = String(entry.name ?? "");
  const value = Number(entry.value ?? 0);
  const total = Number(entry.__total__ ?? 0);
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return `${name}: ${percentage}%`;
};

/* -------------------------
   Risk Distribution Chart Component
   ------------------------- */
const RiskDistributionChart: React.FC<{
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

/* -------------------------
   Predictions Over Time Chart Component
   ------------------------- */
const PredictionsOverTimeChart: React.FC<{
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

/* -------------------------
   SummaryCard
   ------------------------- */
const SummaryCard: React.FC<{
  title: string;
  value: string | number | undefined;
  icon: React.ReactElement;
  loading: boolean;
  subtitle?: string;
  color?: "error" | "success" | "primary" | "info";
}> = ({ title, value, icon, loading, subtitle}) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ p: 1, borderRadius: 2 }}>
          {icon}
        </Box>
      </Box>

      {loading ? (
        <Skeleton variant="text" width="60%" height={40} />
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "text.primary" }}>
            {value ?? "—"}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

/* -------------------------
   Main Dashboard component
   ------------------------- */
const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isError) {
    return (
      <Box p={6}>
        <Alert severity="error">Failed to load dashboard data. Please try again later.</Alert>
      </Box>
    );
  }

  const riskPercentage =
    data && data.total_predictions > 0
      ? ((data.high_risk / data.total_predictions) * 100).toFixed(1)
      : "0";

  const latestUploadDate = data?.latest_upload
    ? new Date(data.latest_upload).toLocaleDateString()
    : "—";

  const latestUploadTime = data?.latest_upload
    ? new Date(data.latest_upload).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Security Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of vulnerability predictions and risk analysis
        </Typography>
      </Box>

      {data && data.high_risk > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 4 }}
          action={<Chip label={`${riskPercentage}% High Risk`} color="warning" size="small" />}
        >
          {data.high_risk} high-risk vulnerabilities detected that require immediate attention
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <SummaryCard
            title="Total Predictions"
            value={data?.total_predictions?.toLocaleString()}
            icon={<TrendingUp />}
            loading={isLoading}
            color="primary"
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <SummaryCard
            title="High Risk"
            value={data?.high_risk?.toLocaleString()}
            icon={<Warning sx={{ color: COLORS.highRisk }} />}
            loading={isLoading}
            subtitle="Requires immediate action"
            color="error"
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <SummaryCard
            title="Low Risk"
            value={data?.low_risk?.toLocaleString()}
            icon={<Security sx={{ color: COLORS.lowRisk }} />}
            loading={isLoading}
            subtitle="Monitor regularly"
            color="success"
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <SummaryCard
            title="Latest Upload"
            value={latestUploadDate}
            icon={<Upload />}
            loading={isLoading}
            subtitle={latestUploadTime}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 6}}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Risk Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Breakdown of high vs low risk vulnerabilities
              </Typography>
              <RiskDistributionChart data={data} loading={isLoading} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, md: 6}}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Prediction Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Daily prediction volume over time
              </Typography>
              <PredictionsOverTimeChart data={data} loading={isLoading} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
