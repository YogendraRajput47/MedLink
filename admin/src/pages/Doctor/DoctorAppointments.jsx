import React, { useContext, useEffect, useRef } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const rowsRef = useRef([]);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  // Animate rows once appointments are loaded
useGSAP(() => {
  if (appointments.length > 0 && rowsRef.current) {
    gsap.fromTo(
      rowsRef.current,
      {
        opacity: 0,
        x: 100,
      },
      {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rowsRef.current[0],
          start: "top 90%",
        },
      }
    );
  }
}, [appointments.length>0]);


  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-5 text-2xl font-semibold text-gray-800">
        All Appointments
      </p>

      <div className="bg-white text-sm border rounded max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-xl ">
        {/* Table Header */}
        <div className="max-sm:hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-primary text-white font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments
          .slice()
          .reverse()
          .map((item, index) => (
            <div
              key={index}
              ref={(el) => (rowsRef.current[index] = el)}
              className="flex flex-wrap justify-between max-sm:gap-5 mx-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={item.userData.image}
                  alt="user_image"
                />
                <p>{item.userData.name}</p>
              </div>
              <div>
                <p
                  className={`text-sm inline px-2 ${
                    item.payment
                      ? "text-green-700 bg-green-100"
                      : "text-yellow-700 bg-yellow-100"
                  } rounded-full`}
                >
                  {item.payment ? "Online" : "CASH"}
                </p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <p>
                {currency}
                {item.amount}
              </p>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-400 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
