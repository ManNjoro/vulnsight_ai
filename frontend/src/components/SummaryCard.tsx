import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";

export const SummaryCard: React.FC<{
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