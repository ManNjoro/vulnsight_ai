import { Box, Typography } from "@mui/material";
import type { RDTooltipProps } from "../types/types";

export const RiskDistributionTooltip: React.FC<
  RDTooltipProps & { total: number }
> = ({ active, payload, total }) => {
  if (!active || !payload || payload.length === 0) return null;

  const itemPayload = payload[0].payload;
  const itemValue = payload[0].value ?? itemPayload?.value ?? 0;

  const percentage = total > 0 ? ((itemValue / total) * 100).toFixed(1) : "0.0";

  return (
    <Box
      sx={{
        bgcolor: "white",
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
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
