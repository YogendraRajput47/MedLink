import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DoctorContext } from "../context/DoctorContext";

gsap.registerPlugin();

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  const logout = () => {
    navigate("/");
    if (aToken || dToken) {
      aToken && setAToken("");
      dToken && setDToken("");
      aToken && localStorage.removeItem("aToken");
      dToken && localStorage.removeItem("dToken");
    }
  };

  useGSAP(() => {
    gsap.from(navbarRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="sticky top-0 z-50 flex justify-between items-center px-5 sm:px-10
       h-[10vh] border-b bg-white"
    >
      {/* Left - Logo + Badge */}
      <div className="flex items-center gap-5">
        <img
          className="w-32 sm:w-22 h-10 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          src={assets.admin_logo}
          alt="admin_logo"
        />
        <span className="px-3 py-1 text-sm rounded-full border border-gray-300 bg-gray-50 text-gray-600 font-semibold shadow-sm">
          {aToken ? "Admin" : "Doctor"}
        </span>
      </div>

      {/* Right - Logout button */}
      <button
        onClick={logout}
        className="bg-primary text-white font-medium px-6 sm:px-8 py-2.5 rounded-full shadow-md hover:bg-secondary hover:shadow-lg transition-all duration-300"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
