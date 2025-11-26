import { Box, Typography } from "@mui/material";
import type { TimeTooltipProps } from "../types/types";
import { COLORS } from "../utils/constants";

export const PredictionsOverTimeTooltip: React.FC<TimeTooltipProps> = ({
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