import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "../types/types";
import { useState } from "react";


interface UseFetchTableProps {
  queryKey: string;
  fetchFunc: (params: URLSearchParams) => Promise<any>;
  params?: Record<string, any>;
}

const useFetchTableData = ({
  queryKey,
  fetchFunc,
  params = {},
}: UseFetchTableProps) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, paginationModel.page, paginationModel.pageSize, params],
    queryFn: async () => {
      const page = paginationModel.page + 1;

      const queryParams = new URLSearchParams({
        page: String(page),
        page_size: String(paginationModel.pageSize),
        ...Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
        ),
      });

      const res = await fetchFunc(queryParams);
      return res.data as PaginatedResponse<any>;
    },
    keepPreviousData: true,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    paginationModel,
    setPaginationModel,
  };
};

export default useFetchTableData;
