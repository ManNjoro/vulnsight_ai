import { NavLink } from "react-router-dom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Sidebar = () => {
  return (
    <div className="min-h-full w-64 bg-gray-900 text-white flex flex-col p-5 space-y-5">
      <h1 className="text-2xl font-bold tracking-wide">VulnSight AI</h1>

      <nav className="flex flex-col space-y-4 mt-6">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <CloudUploadIcon />
          <span>Upload File</span>
        </NavLink>

        <NavLink
          to="/results"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <AssessmentIcon />
          <span>Prediction Results</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
