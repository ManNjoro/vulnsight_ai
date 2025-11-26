import type { GridColDef } from "@mui/x-data-grid";

export function titleCase(str: string) {
  if(!str) return null
  const transformed = str.split("_").join(" ");
  return transformed
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
}

export function transformColumns<T extends GridColDef>(columns: T[]): T[] {
  return columns.map((col) => ({
    ...col,
    headerName: titleCase(col.headerName ?? ""),
  }));
}
