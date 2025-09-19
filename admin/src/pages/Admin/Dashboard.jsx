import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { aToken, dashData, getDashboardData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getDashboardData();
  }, [aToken]);

  const barData = [
    { day: "Mon", appointments: 4 },
    { day: "Tue", appointments: 6 },
    { day: "Wed", appointments: 2 },
    { day: "Thu", appointments: 7 },
    { day: "Fri", appointments: 5 },
    { day: "Sat", appointments: 3 },
    { day: "Sun", appointments: 4 },
  ];

  const pieData = [
    { name: "Doctors", value: dashData.doctors || 0 },
    { name: "Patients", value: dashData.patients || 0 },
  ];

  const lineData = [
    { month: "Apr", count: 20 },
    { month: "May", count: 35 },
    { month: "Jun", count: 25 },
    { month: "Jul", count: 40 },
    { month: "Aug", count: 38 },
    { month: "Sep", count: 45 },
  ];

  const COLORS = ["#6366f1", "#f59e0b"];

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-gray-50">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            {
              label: "Doctors",
              value: dashData.doctors,
              icon: assets.doctor_icon,
              color: "bg-green-100 text-green-700",
            },
            {
              label: "Appointments",
              value: dashData.appointments,
              icon: assets.appointments_icon,
              color: "bg-blue-100 text-blue-700",
            },
            {
              label: "Patients",
              value: dashData.patients,
              icon: assets.patients_icon,
              color: "bg-yellow-100 text-yellow-700",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-200"
            >
              <div className={`p-3 rounded-xl ${card.color}`}>
                <img className="w-10" src={card.icon} alt={card.label} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold">
                  {card.value}
                </p>
                <p className="text-lg sm:text-xl text-gray-600">{card.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Appointments This Week
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a5b4fc" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    background: "#f9fafb",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              User Distribution
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    background: "#f9fafb",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Monthly Appointment Trend
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    background: "#f9fafb",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#6366f1" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Latest Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 px-4 sm:px-6 py-3 border-b">
            <img
              src={assets.list_icon}
              alt="list_icon"
              className="w-5 sm:w-6"
            />
            <p className="font-semibold text-lg sm:text-xl text-gray-700">
              Latest Bookings
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {dashData?.latestAppointments?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center sm:items-start px-4 sm:px-6 py-3 gap-3 sm:gap-4 hover:bg-gray-50 border-b transition"
              >
                <img
                  className="rounded-full w-12 h-12 object-cover border"
                  src={item.docData.image}
                  alt="doctor"
                />
                <div className="flex-1 text-sm text-center sm:text-left">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-500">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-400 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <img
                    onClick={() => cancelUserAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="cancel_icon"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
