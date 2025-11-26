// hooks/useFetchTableData.ts
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PaginatedResponse } from "../types/types";

interface UseFetchTableProps<T> {
  queryKey: string;
  fetchFunc: (params: URLSearchParams) => Promise<{ data: PaginatedResponse<T> }>;
  params?: Record<string, any>;
}

function useFetchTableData<T>({
  queryKey,
  fetchFunc,
  params = {},
}: UseFetchTableProps<T>) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const query = useQuery({
    queryKey: [queryKey, paginationModel.page, paginationModel.pageSize, params],
    queryFn: async () => {
      const page = paginationModel.page + 1;

      const queryParams = new URLSearchParams({
        page: String(page),
        page_size: String(paginationModel.pageSize),
        ...Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v != null && v !== "")
        ),
      });

      const response = await fetchFunc(queryParams);
      return response.data; // This is PaginatedResponse<T>
    },
    keepPreviousData: true,
    // Explicitly tell React Query the data type
  }) as {
    data: PaginatedResponse<T> | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // ... other properties
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    paginationModel,
    setPaginationModel,
  };
}

export default useFetchTableData;