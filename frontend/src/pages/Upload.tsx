import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import vulnerabilityApi from "../api/vulnerability";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
        const formData = new FormData();
      formData.append("file", file);
      const res = await vulnerabilityApi.predict(file);
      if(res.status === 200) navigate('/results')
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Upload CVE Dataset</h1>

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || loading}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        Upload & Predict
      </Button>

    </div>
  );
};

export default Upload;
