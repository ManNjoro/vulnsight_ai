import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FolderIcon from "@mui/icons-material/Folder";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import vulnerabilityApi from "../api/vulnerability";
import DataTable from "../components/DataTable";
import useFetchTableData from "../hooks/useFetchTableData";
import type { PredictionResult } from "../types/types";
import Select from "../components/Select";
import { predictionOptions } from "../utils/dropDownData";
import StatusBadge from "../components/StatusBadge";

const Results = () => {
  const [filters, setFilters] = useState({
    search: "",
    prediction: "",
  });

  const {
    data,
    isLoading,
    isError,
    error,
    paginationModel,
    setPaginationModel,
  } = useFetchTableData<PredictionResult>({
    queryKey: "prediction-results",
    fetchFunc: vulnerabilityApi.getPredictionResults,
    params: filters,
  });

  const columns: GridColDef<PredictionResult>[] = [
    { field: "cve_id", headerName: "CVE ID", flex: 1 },
    {
      field: "prediction",
      headerName: "Prediction",
      flex: 1,
      valueGetter: (params) => {
        const val = params;
        if (val === 0) return "Safe";
        if (val === 1) return "Vulnerable";
        return "Unknown";
      },
      renderCell: (params: GridRenderCellParams<PredictionResult, string>) => <StatusBadge status={String(params.row.prediction)}  />,
    },
    {
      field: "risk_probability",
      headerName: "Risk Probability",
      flex: 1,
      renderCell: (params) =>
        `${(params.row.risk_probability * 100).toFixed(2)}%`,
    },
    {
      field: "uploaded_at",
      headerName: "Date Uploaded",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params),
      renderCell: (params) => {
        const date = new Date(params.row.uploaded_at);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
      },
    },
    { field: "original_filename", headerName: "Original Filename", flex: 1 },
  ];

  const handleClearFilters = () => {
    setFilters({
      prediction: "",
      search: "",
    });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handlePredictionStatusFilterChange = (val: string) => {
    setFilters((prev) => ({
      ...prev,
      prediction: val,
    }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: event.target.value,
    }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const hasActiveFilters = filters.search || filters.prediction;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error loading results: {error?.message}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outlined"
            className="mt-4"
            startIcon={<RefreshIcon className="w-4 h-4 mr-2" />}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Prediction Results
          </h1>
          <p className="text-secondary-600 mt-1">
            {data
              ? `Total: ${data.count} rows`
              : "Monitor and manage predictions"}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={handleClearFilters}
            variant="outlined"
            disabled={!hasActiveFilters}
            startIcon={<RefreshIcon className="w-4 h-4 mr-2" />}
          >
            Clear Filters
          </Button>
        </div>
      </div>
{!isLoading && data?.results?.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderIcon className="w-8 h-8 text-gray-400" />
            </div>
            <Typography variant="h6" className="text-secondary-900 mb-2">
              No Results found
            </Typography>
            <Typography variant="body2" className="text-secondary-600 mb-4">
              {hasActiveFilters
                ? "No results match your current filters."
                : "There are no results in the system yet."}
            </Typography>
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} variant="outlined">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )
      :
              <>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <FilterAltIcon className="w-5 h-5 text-secondary-500" />
              <Typography variant="subtitle1" className="text-secondary-900">
                Filters
              </Typography>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <TextField
                size="small"
                placeholder="Search CVE ID..."
                value={filters.search}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="w-4 h-4 text-gray-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                className="w-full sm:w-64"
              />
              <div className="min-w-[150px]">
                <Select
                  helperText=""
                  label="Prediction"
                  onChange={handlePredictionStatusFilterChange}
                  options={predictionOptions}
                  value={filters.prediction}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* DataGrid */}
      <DataTable
        rows={data?.results || []}
        columns={columns}
        loading={isLoading}
        rowCount={data?.count || 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
              </>
    }

      
    </div>
  );
};

export default Results;
