import { useState, useRef } from "react";
import { 
  Button, 
  CircularProgress, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Alert,
  Chip,
  Paper
} from "@mui/material";
import { CloudUpload, Description, CheckCircle } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import vulnerabilityApi from "../api/vulnerability";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadZone = styled(Paper)<{ dragactive?: string }>(({ theme, dragactive }) => ({
  border: `2px dashed ${dragactive === 'true' ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: dragactive === 'true' ? theme.palette.action.hover : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile: File | null) => {
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx)');
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await vulnerabilityApi.predict(formData);
      if (res.status === 200) {
        navigate('/results');
      }
    } catch (error) {
      if(isAxiosError(error))
        return setError(error.response?.data?.error || "Upload failed")
      console.error(error);
      setError("Upload failed. Please try again.");
    } finally{

      setLoading(false);
    }

  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
            Upload CVE Dataset
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Upload your CVE dataset in CSV or Excel format to analyze and predict vulnerabilities.
          </Typography>

          {/* Upload Zone */}
          <UploadZone 
            dragactive={isDragActive.toString()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleZoneClick}
            elevation={isDragActive ? 2 : 1}
          >
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to browse files
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              Supports: CSV, Excel (Max: 10MB)
            </Typography>
          </UploadZone>

          {/* Hidden file input */}
          <VisuallyHiddenInput
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />

          {/* Selected File Info */}
          {file && (
            <Box sx={{ mt: 3, p: 2, border: 1, borderColor: 'success.light', borderRadius: 2, bgcolor: 'success.light' + '1a' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                <Typography variant="subtitle1" fontWeight="medium">
                  File Selected
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Description color="action" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
                <Chip 
                  label="Ready to upload" 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {/* Upload Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleUpload}
              disabled={!file || loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />
              }
              sx={{ 
                minWidth: 200,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              {loading ? 'Processing...' : 'Upload & Predict'}
            </Button>
          </Box>

          {/* Help Text */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Your file will be processed securely and used only for vulnerability prediction.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Upload;