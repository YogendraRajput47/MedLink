import React, { useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashboardData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashboardData();
    }
  }, [dToken,dashData]);

  const earningsData = [
    { day: "Mon", earnings: 40 },
    { day: "Tue", earnings: 30 },
    { day: "Wed", earnings: 15 },
    { day: "Thu", earnings: 25 },
    { day: "Fri", earnings: 30 },
  ];

  const appointmentsData = [
    { day: "Mon", count: 1 },
    { day: "Tue", count: 0 },
    { day: "Wed", count: 2 },
    { day: "Thu", count: 1 },
    { day: "Fri", count: 0 },
  ];

  const patientsData = [
    { day: "Mon", patients: 1 },
    { day: "Tue", patients: 1 },
    { day: "Wed", patients: 2 },
    { day: "Thu", patients: 2 },
    { day: "Fri", patients: 3 },
  ];

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-gray-50">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* === Stats Cards === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            {
              label: "Earnings",
              value: `${currency}${dashData.earnings || 0}`,
              icon: assets.earning_icon,
              color: "bg-green-100 text-green-700",
            },
            {
              label: "Total Appointments",
              value: dashData.totalAppointments || 0,
              icon: assets.appointments_icon,
              color: "bg-blue-100 text-blue-700",
            },
            {
              label: "Patients",
              value: dashData.patients || 0,
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

        {/* === Graphs Section === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Earnings Line Chart */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Earnings This Week
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={earningsData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Appointments Bar Chart */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Appointments This Week
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={appointmentsData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Patients Area Chart */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Patients Growth
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={patientsData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#f59e0b"
                  fill="#fcd34d"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* === Latest Appointments === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 sm:px-6 py-3 border-b">
            <img
              src={assets.list_icon}
              alt="list_icon"
              className="w-5 sm:w-6"
            />
            <p className="font-semibold text-lg sm:text-xl text-gray-700">
              Latest Appointments
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {dashData?.latestAppointments?.map((item, index) => (
              <div
                className="flex flex-col sm:flex-row items-center sm:items-start px-4 sm:px-6 py-3 gap-3 sm:gap-4 hover:bg-gray-50 border-b transition"
                key={index}
              >
                <img
                  className="rounded-full w-12 h-12 object-cover border"
                  src={item.userData?.image}
                  alt="patient"
                />
                <div className="flex-1 text-sm text-center sm:text-left">
                  <p className="text-gray-800 font-medium">
                    {item.userData?.name}
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
                  <div className="flex">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
