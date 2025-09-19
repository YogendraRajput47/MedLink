import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import useScrollDirection from "../hooks/useScrollDirection";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AppContext } from "../context/AppContext";
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const scrollDirection = useScrollDirection();
  const {token,setToken,userData} = useContext(AppContext);

  const logout=() => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white z-50 border-b border-b-gray-400 text-sm transition-transform duration-1000 md:pl-[3.9%]
      md:pr-[6.5%]
      ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="flex flex-row justify-between items-center py-4 px-6 md:px-12">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          className="w-44 h-10 object-cover cursor-pointer"
          src={assets.logo}
          alt="logo"
        />

        {/* Links */}
        <ul className="hidden md:flex flex-row items-start gap-5 font-medium">
          <NavLink to={"/"}>
            <li className="py-1">HOME</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to={"/doctors"}>
            <li className="py-1">ALL DOCTORS</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to={"/about"}>
            <li className="py-1">ABOUT</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to={"/contact"}>
            <li className="py-1">CONTACT</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
        </ul>

        {/* Profile / Auth */}
        <div className="flex items-center gap-4 h-full">
          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img
                className="w-10 h-10 object-cover rounded-full"
                src={userData?.image}
                alt="profile"
              />
              <img
                className="w-2.5"
                src={assets.dropdown_icon}
                alt="dropdown"
              />
              <div className="absolute z-20 top-0 right-0 pt-14 text-base font-medium text-gray-600 hidden group-hover:block">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-2 transition-all duration-300">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="w-full hover:text-black cursor-pointer hover:bg-stone-200 px-4 py-2 "
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="w-full hover:text-black cursor-pointer hover:bg-stone-200 px-4 py-2"
                  >
                    My Appointment
                  </p>
                  <p
                    onClick={logout}
                    className="w-full hover:text-black cursor-pointer hover:bg-stone-200 px-4 py-2"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-8 py-3 rounded-full font-medium hidden md:block"
            >
              Create account
            </button>
          )}

          <img
            onClick={() => setShowMenu(true)}
            className="w-6  md:hidden"
            src={assets.menu_icon}
            alt="menu_icon"
          />

          {/* ----------Mobile Menu------- */}
          <div
            className={`${
              showMenu ? "fixed w-full h-screen" : "h-0 w-0"
            } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-200`}
          >
            <div className="flex items-center justify-between px-5 py-6">
              <img className="w-36" src={assets.logo} alt="logo" />
              <img
                className="w-7"
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                alt="cross_icon"
              />
            </div>
            <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
              <li className="w-full">
                <NavLink
                  className="px-4 py-2 rounded inline-block w-full"
                  onClick={() => setShowMenu(false)}
                  to={"/"}
                >
                  <p className="w-full text-center py-2 rounded-md">HOME</p>
                </NavLink>
              </li>
              <li className="w-full">
                <NavLink
                  className="px-4 py-2 rounded inline-block w-full"
                  onClick={() => setShowMenu(false)}
                  to={"/doctors"}
                >
                  <p className="w-full text-center py-2 rounded-md">
                    ALL DOCTORS
                  </p>
                </NavLink>
              </li>
              <li className="w-full">
                <NavLink
                  className="px-4 py-2 rounded inline-block w-full"
                  onClick={() => setShowMenu(false)}
                  to={"/about"}
                >
                  <p className="w-full text-center py-2 rounded-md">ABOUT</p>
                </NavLink>
              </li>
              <li className="w-full">
                <NavLink
                  className="px-4 py-2 rounded inline-block w-full"
                  onClick={() => setShowMenu(false)}
                  to={"/contact"}
                >
                  <p className="w-full text-center py-2 rounded-md">CONTACT</p>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
