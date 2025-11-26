// hooks/useFetchTableData.ts
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PaginatedResponse } from "../types/types";

interface UseFetchTableProps<T> {
  queryKey: string;
  fetchFunc: (params: URLSearchParams) => Promise<{ data: PaginatedResponse<T> }>;
  params?: Record<string, string | number | boolean>;
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

  const { data, isLoading, isError, error } = useQuery<PaginatedResponse<T>, Error>({
    queryKey: [queryKey, paginationModel.page, paginationModel.pageSize, params],
    queryFn: async () => {
      const page = paginationModel.page + 1;

      const searchParams = new URLSearchParams({
        page: String(page),
        page_size: String(paginationModel.pageSize),
        ...Object.fromEntries(
          Object.entries(params).filter(([, value]) => 
            value != null && value !== ""
          )
        ),
      });

      const response = await fetchFunc(searchParams);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    paginationModel,
    setPaginationModel,
  };
}

export default useFetchTableData;