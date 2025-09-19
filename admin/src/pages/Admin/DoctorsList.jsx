import React, { useContext, useRef } from "react";
import { AdminContext } from "../../context/AdminContext";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeDoctorAvailability } =
    useContext(AdminContext);

  const containerRef = useRef(null);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  useGSAP(() => {
    const cards = containerRef.current.querySelectorAll(".doctor-card");

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
          ease: "power2.out",
        }
      );
    });
  }, [doctors.length>0]);

  return (
    <div className="m-5 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800">All Doctors</h1>
      <div
        ref={containerRef}
        className="w-full flex flex-wrap gap-4 pt-5 gap-y-6"
      >
        {doctors.map((doctor) => (
          <div
            className="doctor-card border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={doctor._id}
          >
            <img
              className="bg-indigo-50 group-hover:bg-indigo-100 transition-all duration-500"
              src={doctor.image}
              alt={doctor.name}
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {doctor.name}
              </p>
              <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
              <div className="mt-2 flex gap-1 items-center text-sm">
                <input
                  onChange={() => changeDoctorAvailability(doctor._id)}
                  type="checkbox"
                  checked={doctor.availabel}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
