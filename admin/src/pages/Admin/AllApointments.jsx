import React, { useContext, useEffect, useRef } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import gsap from "gsap";

const AllApointments = () => {
  const { aToken, appointments, getAllAppointments, cancelUserAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  
  const containerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  useEffect(() => {
    if (appointments.length > 0) {
      // Container animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Rows stagger animation
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, [appointments.length > 0]);

  return (
    <div className="w-full max-w-6xl m-5" ref={containerRef}>
      <p className="mb-5 text-2xl font-semibold text-gray-800">
        All Appointments
      </p>
      <div className="bg-white text-sm border rounded max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-xl">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-primary text-white font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Rows */}
        {appointments.length > 0 &&
          appointments.map((item, index) => (
            <div
              ref={(el) => (rowsRef.current[index] = el)}
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
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
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  src={item.docData.image}
                  alt="user_image"
                />
                <p>{item.docData.name}</p>
              </div>
              <p>
                {currency}
                {item.docData.fees}
              </p>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-400 text-xs font-medium">Completed</p>
              ) : (
                <img
                  onClick={() => cancelUserAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt="cancel_icon"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllApointments;
