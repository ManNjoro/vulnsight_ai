import type { PieEntry } from "../types/types";

export const renderPieLabel = (entry: PieEntry) => {
  // entry is the Pie entry — keep it flexible but typed locally
  const name = String(entry.name ?? "");
  const value = Number(entry.value ?? 0);
  const total = Number(entry.__total__ ?? 0);
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return `${name}: ${percentage}%`;
};