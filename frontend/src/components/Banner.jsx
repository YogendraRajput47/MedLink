import React, { useRef } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";
import useCountUp from "../hooks/useCountUp";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const Banner = () => {
  const navigate = useNavigate();
  const { count, ref } = useCountUp(100, 1500);
 const topRef = useRef();

 useGSAP(() => {
   gsap.fromTo(
     topRef.current,
     { opacity: 0, x: 100 },
     {
       x: 0,
       opacity: 1,
       duration: 0.5,
       delay: 0.2,
       scrollTrigger: {
         trigger: topRef.current,
         start: "top 50%",
       },
     }
   );
 }, []);


  return (
    <div ref={topRef} className="w-full flex px-6 sm:px-10 md:px-14 lg:px-12 border-b border-primary my-20 md:mx-10 rounded-lg  ">
      {/* ----------------Left-side ---------------*/}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold ">
          <p>Book Appointment </p>
          <p className="mt-4  text-gray-800 font-medium">
            With{" "}
            <span
              ref={ref}
              className="inline-block w-10 mr-[9%] text-center font-semibold"
            >
              {count}+
            </span>
            <span className="block md:inline-block  md:mt-2">
              Trusted Doctors
            </span>
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="relative px-8 py-3 rounded-full font-medium text-white mt-6 overflow-hidden group"
        >
          <span className="relative z-10 text-indigo-500">Create Account</span>

          {/* Animated gradient border */}
          <span
            className="absolute inset-0 rounded-full p-[2px] 
    bg-gradient-to-r from-purple-600  to-indigo-500 
    bg-[length:200%_200%] motion-safe:animate-shine-pulse"
          ></span>

          {/* Inner background */}
          <span className="absolute inset-[2px] rounded-full bg-white"></span>
        </button>
      </div>

      {/* ----------------Right-side---------------- */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        {/* Glow effect */}
        <div className="absolute -z-10 w-60 h-60 bg-primary rounded-full blur-3xl opacity-0 bottom-10 right-10 animate-wavy-glow"></div>

        {/* Image */}
        <img
          className="w-full  absolute bottom-0 right-0 max-w-md"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
