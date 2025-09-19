import React, { useRef } from "react";
import { assets } from "../assets/assets_frontend/assets";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const topRef = useRef();
  const contentRef = useRef();

  useGSAP(() => {
    // Animate the whole video section
    gsap.fromTo(
      topRef.current,
      { opacity: 0, y: 100 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        scrollTrigger: {
          trigger: topRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate the text/button content over the video
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        // delay: 0.3,
        scrollTrigger: {
          trigger: topRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div ref={topRef} className="w-full mb-4 overflow-hidden mt-24 ">
      <div className="w-full relative  overflow-hidden ">
        {/* Background video */}
        <video
          loop
          autoPlay
          muted
          playsInline
          className="w-full h-[80vh] object-cover"
          src={assets.header_video}
        ></video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div
          ref={contentRef}
          className="absolute bottom-[15%] left-[10%] z-10 
                     flex flex-col items-start justify-center gap-6 p-2"
        >
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight">
            Book Appointment <br /> With Trusted Doctors
          </p>

          <div className="flex flex-col items-start md:flex-row md:items-center gap-3 text-sm font-light text-gray-100">
            <img className="w-28" src={assets.group_profiles} alt="profiles" />
            <p>
              Simply browse through our extensive list of trusted doctors,
              <br className="hidden sm:block" />
              schedule your appointment hassle-free.
            </p>
          </div>

          <a
            href="#speciality"
            className="flex items-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full text-sm font-medium shadow-md hover:scale-105 transition-all duration-300"
          >
            Book appointment
            <img className="w-3" src={assets.arrow_icon} alt="arrow" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
