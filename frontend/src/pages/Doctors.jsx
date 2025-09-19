import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const topRef = useRef();
  const specialityRef = useRef();

  // Animate doctor cards
  useGSAP(() => {
    gsap.fromTo(
      topRef.current,
      { opacity: 0, y: 100 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        stagger: 0.2,
      }
    );
  }, [filterDoc]);

  // Animate speciality items on scroll
  useGSAP(() => {
    const items = specialityRef.current.querySelectorAll(".speciality-item");
    gsap.fromTo(
      items,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: specialityRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  // Animate speciality items when filter opens (mobile)
  useGSAP(() => {
    if (showFilter) {
      const items = specialityRef.current.querySelectorAll(".speciality-item");
      gsap.fromTo(
        items,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [showFilter]);

  const doctorsSpeciality = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter((doctor) => doctor.speciality === speciality)
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="my-24">
      <p className="text-gray-600 text-md font-bold">
        Browse All Verified Doctors & Specialists in One Place
      </p>
      <button
        onClick={() => setShowFilter((prev) => !prev)}
        className={`px-3 py-1 border rounded text-sm transition-all sm:hidden mt-2 ${
          showFilter ? "bg-primary text-white" : ""
        }`}
      >
        Filters
      </button>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Speciality list */}
        <div
          ref={specialityRef}
          className={`flex flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {doctorsSpeciality.map((item, index) => (
            <p
              key={index}
              onClick={() => {
                speciality === item
                  ? navigate("/doctors")
                  : navigate(`/doctors/${item}`);
              }}
              className={`speciality-item w-[94vw] sm:w-auto pl-3 whitespace-nowrap py-2 pr-16 border rounded-md cursor-pointer hover:bg-primary hover:text-white transition-all duration-200 ${
                speciality === item
                  ? "bg-primary text-white"
                  : "border-primary text-primary"
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Doctors grid */}
        {filterDoc.length > 0 ? (
          <div
            ref={topRef}
            className="w-full grid grid-cols-auto gap-4 gap-y-6"
          >
            {filterDoc.map((doctor, index) => (
              <div
                onClick={() => navigate(`/appointment/${doctor._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                key={index}
              >
                <img
                  className="bg-blue-50 hover:bg-blue-100 transition-all duration-300"
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
                  </div>w
                  <p className="text-gray-900 text-lg font-medium">
                    {doctor.name}
                  </p>
                  <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={topRef}
            className="w-full h-[42vh] flex justify-center items-center sm:text-2xl md:text-3xl lg:text-4xl text-primary"
          >
            No doctors available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
