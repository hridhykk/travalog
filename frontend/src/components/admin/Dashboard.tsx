import  {useEffect, useState} from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";
const Dashboard: React.FC = () => {
  const [range, setRange] = useState<string>("all");

 const buttonOptions = ["daily", "weekly", "monthly", "yearly"];
  const [statsData, setStatsData] = useState([
    { name: "Total Vendors", value:0, icon: "👥" },
    { name: "Total  Users", value: 0, icon: "👤" },
    { name: "Total Uploads", value: 0, icon: "⬆️" },
    { name: "Total Revenue", value: 0, icon: "💰" },
    { name: "Total Vendor Revenue", value: 0, icon: "💰" },
    { name: "Total Bookings", value: 0, icon: "⬆️" },
  ]);

  const [pieChartData, setPieChartData] = useState([
 { name: "Total Vendors", value:0},
    { name: "Total  Users", value: 0 },
    { name: "Total Uploads", value: 0 },
    { name: "Total Revenue", value: 0 },
    { name: "Total Vendor Revenue", value: 0 },
    { name: "Total Bookings", value: 0 },
  ]);

useEffect(() => {
  const fetchDashboardData = async (range: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/fetchdashboarddata?range=${range}`);
      const data = response.data.dashboardData; 

      const updatedStats = statsData.map((item) => {
        const dataItem = data.find((d: any) => d.name === item.name);
        return {
          ...item,
          value: dataItem ? dataItem.value : item.value,
        };
      });

      setStatsData(updatedStats);

      const updatedPie = pieChartData.map((item) => {
        const dataItem = data.find((d: any) => d.name === item.name);
        return {
          ...item,
          value: dataItem ? dataItem.value : item.value,
        };
      });

      setPieChartData(updatedPie);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  fetchDashboardData(range);
}, [range]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="bg-gray-200 p-6 h-screen overflow-auto">
      <h2 className="text-2xl font-bold mb-6 bg-white p-2 rounded shadow">
        DASHBOARD
      </h2>
     
        <div className="flex flex-1 justify-around mb-4">
         {buttonOptions.map((btn) => (
          <button
            key={btn}
            onClick={() => setRange(btn)}
            className={`w-[100px] py-2 rounded text-white ${
              range === btn ? "bg-green-700" : "bg-green-500"
            } hover:bg-green-400`}
          >
            {btn}
          </button>
        ))}


<button className="bg-green-500 text-white w-[100px] py-2 rounded hover:bg-green-400">
 Sales Report
</button>
        </div>
      
      <div className="flex flex-wrap lg:flex-nowrap  gap-4 mb-8 overflow-hidden ">
        {statsData.map((stat) => (
          <div
            key={stat.name}
            className="bg-white  rounded-lg shadow h-40 p-4 flex-1 flex-col justify-between sm:flex-row"
          >
            <div className="lg:w-[130px] lg:h-[70px] flex  justify-between  ">
              <p className="text-gray-500">{stat.name}</p>
              <span className="text-3xl">{stat.icon}</span>
            </div>

            <p className="text-2xl font-bold ">
              {stat.name === "Total Revenue"|| stat.name === "Total Vendor Revenue" ? `₹${stat.value}` : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {pieChartData.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
