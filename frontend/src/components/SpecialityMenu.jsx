import React, { useRef } from "react";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);


const SpecialityMenu = () => {
    const topRef = useRef();
  
    useGSAP(() => {
      gsap.fromTo(
        topRef.current,
        { opacity: 0, x: 100 },
        {
          x: 0,
          opacity: 1,
          duration: 1 ,
          delay: 0.2,
          scrollTrigger: {
            trigger: topRef.current,
            start: "top bottom-=100",
          },
        }
      );
    }, []);
  return (
    <div
    ref={topRef}
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
    >
      <h1 className="text-3xl md:text-4xl font-medium">Book by Speciality </h1>
      <p className="sm:w-1/2 text-center text-md">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <div className="flex md:justify-center gap-8 pt-5 w-full overflow-scroll">
        {specialityData.map((item, index) => (
          <Link
            onClick={scrollTo(0,0)}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            key={index}
            to={`/doctors/${item.speciality}`}
          >
            <img className="w-16 sm:w-36 mb-2" src={item.image} alt="" />
            <p className="text-lg">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
