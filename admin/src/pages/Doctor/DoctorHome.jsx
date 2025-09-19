import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaUsers,
  FaChartLine,
  FaMoneyBillWave,
  FaBell,
  FaFileMedical,
} from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const DoctorHome = () => {
  const navigate = useNavigate();
  const welcomeRef = useRef();
  const cardsRef = useRef([]);

  // GSAP Animations
  useGSAP(() => {
    // Animate Welcome Section
    gsap.fromTo(
      welcomeRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Animate Cards Section with stagger
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
        delay: 0.3,
      }
    );
  }, []);

  // Helper to attach refs to cards
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div className="p-8 w-full min-h-screen">
      {/* Welcome Section */}
      <div
        ref={welcomeRef}
        className="bg-white shadow-md rounded-2xl p-8 mb-10 text-center"
      >
        <h1 className="text-3xl font-semibold mb-2">Welcome Back, Doctor 👋</h1>
        <p className="text-gray-600">
          Manage your appointments, patients, and earnings efficiently.
        </p>
      </div>

      {/* Doctor Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          ref={addToRefs}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-lg text-white text-center"
        >
          <FaCalendarCheck className="text-4xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold">Appointments</h2>
          <p className="mt-1 text-sm text-yellow-100">
            View and manage all your upcoming appointments.
          </p>
        </div>

        <div
          ref={addToRefs}
          className="bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-2xl shadow-lg text-white text-center"
        >
          <FaUsers className="text-4xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold">Patients</h2>
          <p className="mt-1 text-sm text-green-100">
            See details of all your patients.
          </p>
        </div>

        <div
          ref={addToRefs}
          className="bg-gradient-to-r from-pink-500 to-pink-700 p-6 rounded-2xl shadow-lg text-white text-center"
        >
          <FaChartLine className="text-4xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold">Reports</h2>
          <p className="mt-1 text-sm text-pink-100">
            Track your performance and patient analytics.
          </p>
        </div>

        <div
          ref={addToRefs}
          className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 rounded-2xl shadow-lg text-white text-center"
        >
          <FaMoneyBillWave className="text-4xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold">Earnings</h2>
          <p className="mt-1 text-sm text-purple-100">
            Check your payment history and invoices.
          </p>
        </div>

        <div
          ref={addToRefs}
          className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-2xl shadow-lg text-white text-center"
        >
          <FaBell className="text-4xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="mt-1 text-sm text-blue-100">
            Receive updates and announcements.
          </p>
        </div>

        <div
          ref={addToRefs}
          className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6 rounded-2xl shadow-lg text-white text-center"
        >
          <FaFileMedical className="text-4xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold">Medical Records</h2>
          <p className="mt-1 text-sm text-indigo-100">
            Access patient medical histories securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
