import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

import { Security, TrendingUp, Upload, Warning } from "@mui/icons-material";
import { PredictionsOverTimeChart } from "../components/PredictionsOverTimeChart";
import { RiskDistributionChart } from "../components/RiskDistributionChart";
import { SummaryCard } from "../components/SummaryCard";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { COLORS } from "../utils/constants";

const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isError) {
    return (
      <Box p={6}>
        <Alert severity="error">
          Failed to load dashboard data. Please try again later.
        </Alert>
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
    ? new Date(data.latest_upload).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
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
          action={
            <Chip
              label={`${riskPercentage}% High Risk`}
              color="warning"
              size="small"
            />
          }
        >
          {data.high_risk} high-risk vulnerabilities detected that require
          immediate attention
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Total Predictions"
            value={data?.total_predictions?.toLocaleString()}
            icon={<TrendingUp />}
            loading={isLoading}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="High Risk"
            value={data?.high_risk?.toLocaleString()}
            icon={<Warning sx={{ color: COLORS.highRisk }} />}
            loading={isLoading}
            subtitle="Requires immediate action"
            color="error"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Low Risk"
            value={data?.low_risk?.toLocaleString()}
            icon={<Security sx={{ color: COLORS.lowRisk }} />}
            loading={isLoading}
            subtitle="Monitor regularly"
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
        <Grid size={{ xs: 12, md: 6 }}>
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

        <Grid size={{ xs: 12, md: 6 }}>
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
