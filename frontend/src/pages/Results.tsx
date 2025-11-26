import React, { useState } from 'react'
import useFetchTableData from '../hooks/useFetchTableData';
import vulnerabilityApi from '../api/vulnerability';
import { Button, Card, CardContent, InputAdornment, TextField, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from '../components/DataTable';
import FolderIcon from '@mui/icons-material/Folder';

const Results = () => {
    const [filters, setFilters] = useState({
    search: "",
  });

  const {
    data,
    isLoading,
    isError,
    error,
    paginationModel,
    setPaginationModel,
  } = useFetchTableData({
    queryKey: "prediction-results",
    fetchFunc: vulnerabilityApi.getPredictionResults,
    params: filters,
  });

  const columns = [
    {
        field: 'cve_id',
        headerName: 'CVE ID',
        flex: 1
    },
    {
        field: 'prediction',
        headerName: 'Prediction',
        flex: 1
    },
    {
        field: 'prediction',
        headerName: 'Prediction',
        flex: 1
    },
    {
        field: 'risk_probability',
        headerName: 'Risk Probability',
        flex: 1
    },
    {
        field: 'uploaded_at',
        headerName: 'Date uploaded',
        flex: 1
    },
    {
        field: 'original_filename',
        headerName: 'Original Filename',
        flex: 1
    },
  ]

  const handleClearFilters = () => {
    setFilters({
      search: "",
    });
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = (event) => {
    setFilters(prev => ({
      ...prev,
      search: event.target.value
    }));
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  const hasActiveFilters = filters.search;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading payments: {error?.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant='outlined'
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
          <h1 className="text-3xl font-bold text-secondary-900">Prediction Results</h1>
          <p className="text-secondary-600 mt-1">
            {data ? `Total: ${data.count} payments` : 'Monitor and manage payment transactions'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={handleClearFilters}
            variant='outlined'
            disabled={!hasActiveFilters}
            startIcon={<RefreshIcon className="w-4 h-4 mr-2" />}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      

      {/* Filters */}
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
                slotProps={{input:{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="w-4 h-4 text-gray-400" />
                    </InputAdornment>
                  ),
                }}}
                className="w-full sm:w-64"
              />
              
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
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
       
          
        />

      {/* Empty State */}
      {!isLoading && data?.results?.length === 0 && (
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
                ? 'No results match your current filters.'
                : 'There are no results in the system yet.'
              }
            </Typography>
            {hasActiveFilters && (
              <Button 
                onClick={handleClearFilters}
                variant="outlined"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Results