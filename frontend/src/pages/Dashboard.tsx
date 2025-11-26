const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium">Total Predictions</h3>
          <p className="text-3xl font-bold mt-2">–</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium">High-Risk Count</h3>
          <p className="text-3xl font-bold mt-2">–</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium">Latest Upload</h3>
          <p className="text-3xl font-bold mt-2">–</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
