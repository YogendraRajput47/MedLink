import React, { useContext, useRef } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DoctorContext } from "../context/DoctorContext";
import { AiOutlineHome } from "react-icons/ai";

gsap.registerPlugin();

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const sidebarRef = useRef(null);
 

  useGSAP(() => {
    gsap.from(sidebarRef.current, {
      x: -200,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const linkClasses = ({ isActive }) =>
    `group flex items-center gap-4 py-3.5 px-4 md:pl-9 md:pr-20 rounded-xl transition-all duration-300 
     hover:bg-primary hover:text-white hover:shadow-md 
     ${
       isActive
         ? "bg-[#EEF0FF] border-r-4 border-primary text-primary font-semibold"
         : "text-[#555]"
     }
    `;

  return (
    <div
      ref={sidebarRef}
      className={`min-h-screen max-h-screen  w-64 bg-white border-r shadow-sm flex flex-col `}
    >
      {aToken && (
        <ul className="mt-6 flex flex-col gap-2 px-3 text-nowrap">
          <NavLink className={linkClasses} to="/">
            <AiOutlineHome
              className="w-6 h-6 group-hover:brightness-200"
            />
            <p className="hidden md:block">Home</p>
          </NavLink>
          <NavLink className={linkClasses} to="/admin-dashboard">
            <img
              src={assets.home_icon}
              alt="home_icon"
              className="w-5 h-5 group-hover:brightness-200"
            />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={linkClasses} to="/all-appointments">
            <img
              src={assets.appointment_icon}
              alt="appointment_icon"
              className="w-5 h-5 group-hover:brightness-200"
            />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={linkClasses} to="/add-doctor">
            <img
              src={assets.add_icon}
              alt="add_icon"
              className="w-5 h-5 group-hover:brightness-200"
            />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink className={linkClasses} to="/doctor-list">
            <img
              src={assets.people_icon}
              alt="people_icon"
              className="w-5 h-5 group-hover:brightness-200"
            />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="mt-6 flex flex-col gap-2 px-3 text-nowrap">
          <NavLink className={linkClasses} to="/">
            <AiOutlineHome
              className="w-6 h-6 group-hover:brightness-200"
            />
            <p className="hidden md:block">Home</p>
          </NavLink>
          <NavLink className={linkClasses} to="/doctor-dashboard">
            <img
              src={assets.home_icon}
              alt="home_icon"
              className="w-5 h-5 group-hover:brightness-200"
            />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={linkClasses} to="/doctor-appointments">
            <img
              src={assets.appointment_icon}
              alt="appointment_icon"
              className="w-5 h-5 group-hover:brightness-200"
            />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={linkClasses} to="/doctor-profile">
            <img
              src={assets.people_icon}
              alt="people_icon"
              className="w-5 h-5 group-hover:brightness-200"
            />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
