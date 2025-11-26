import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

interface useFetchTableDataProps {
    queryKey: string;
    fetchFunc: () => void;
    params: object
}

const useFetchTableData = ({ queryKey, fetchFunc, params = {} }: useFetchTableDataProps) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, paginationModel.page, paginationModel.pageSize, params],
    queryFn: async () => {
      const page = paginationModel.page + 1; // Convert to 1-based for API
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: paginationModel.pageSize.toString(),
        ...params,
      });
      // Remove any undefined or null values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined || queryParams[key] === null || queryParams[key] === '') {
          delete queryParams[key];
        }
      });
      const res = await fetchFunc(queryParams);
      return res.data;
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