import { DataGrid } from '@mui/x-data-grid'
import { transformColumns } from '../utils/helpers'


const DataTable = ({rows, columns, loading, rowCount,pageSizeOptions=[10, 25, 50], paginationModel, onPaginationModelChange,styles, ...otherProps}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <DataGrid
              rows={rows || []}
              columns={transformColumns(columns)}
              loading={loading}
              rowCount={rowCount || 0}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationModelChange}
              pageSizeOptions={pageSizeOptions}
              // showToolbar
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  // justifyContent: 'center',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb',
                },
                '& .MuiDataGrid-toolbarContainer': {
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid #e5e7eb',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f8fafc',
                },
                "& .MuiDataGrid-columnHeaderTitle": {
            
            fontWeight: 'bold',
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: '#f3f4f6',
            // fontWeight: 700,
          },
          paddingBottom: 3,
                ...(styles ? styles : {}),
              }}
            //   autoHeight
              disableRowSelectionOnClick
              {...otherProps}
            />
          </div>
  )
}

export default DataTable