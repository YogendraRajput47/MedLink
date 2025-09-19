import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const topRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      topRef.current,
      { opacity: 0, y: 100 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: topRef.current,
          start: "top 70%",
        },
        stagger: 0.2,
      }
    );
  }, []);

  return (
    <div
      ref={topRef}
      className="flex flex-col items-center gap-4 my-5 text-gray-900 md:mx-10"
    >
      <h1 className="text-3xl md:text-4xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/2 text-center text-md">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full  grid grid-cols-auto gap-4 pt-5 px-3 gap-y-6 sm:px-0">
        {doctors.slice(0, 10).map((doctor, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${doctor._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img
              className="bg-blue-50  hover:bg-blue-100 transition-all duration-300"
              src={doctor.image}
              alt=""
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <p
                  className={`w-2 h-2 ${
                    doctor.availabel ? "bg-green-500" : "bg-red-500"
                  }   rounded-full`}
                ></p>
                <p
                  className={`${
                    doctor.availabel ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {doctor.availabel ? "Availabel" : "Not availabel"}
                </p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
              <p className="text-gray-600 text-sm">{doctor.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-primary text-white px-12 py-3 rounded-full mt-8 hover:bg-secondary transition-all duration-300"
      >
        See All Doctors →
      </button>
    </div>
  );
};

export default TopDoctors;
