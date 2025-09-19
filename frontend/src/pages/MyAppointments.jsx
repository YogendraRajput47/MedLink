import React, { useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const MyAppointments = () => {
  const { backendUrl, token, getAllDoctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]}  ${
      dateArray[2]
    }`;
  };

  const cardsRef = useRef([]);
  const noRef = useRef();

  useGSAP(() => {
    if (cardsRef?.current?.length) {
      cardsRef.current.forEach((card) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: 100, // start position
          },
          {
            opacity: 1,
            x: 0, // end position
            duration: 2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 100%",
            },
          }
        );
      });
    }
  }, [appointments]);

  useGSAP(() => {
    if (noRef.current) {
      gsap.fromTo(
        noRef.current,
        { opacity: 0, y: 100 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,

          stagger: 0.2,
        }
      );
    }
  });

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPayment = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        const { razorpay_order_id } = response;
        try {
          const { data } = await axios.post(
            `${backendUrl}/user/verify-razorpay`,
            { razorpay_order_id },
            { headers: { token: localStorage.getItem("token") } }
          );
          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
            toast.success(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPayment(data.order);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="mt-24 px-4 sm:px-6 w-full">
      <p className="pb-3 mt-12 text-2xl font-semibold text-zinc-700 border-b">
        My Appointments
      </p>

      {appointments.length === 0 ? (
        <div
          ref={noRef}
          className="text-center w-full  mt-24 mb-24 text-zinc-500 text-4xl  py-10"
        >
          No appointments scheduled.
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {appointments.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 px-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Doctor Image */}
              <div>
                <img
                  className="w-32 h-32 object-cover rounded-lg bg-indigo-50"
                  src={item.docData.image}
                  alt={item.docData.name}
                />
              </div>

              {/* Doctor Details */}
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-lg text-neutral-800 font-semibold">
                  {item.docData.name}
                </p>
                <p className="text-sm text-indigo-600">
                  {item.docData.speciality}
                </p>

                <p className="text-zinc-700 font-medium mt-2">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>

                <p className="text-xs mt-2">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormat(item.slotDate)}| {item.slotTime}
                </p>
              </div>

              {/* Action Buttons */}
              <div className=" flex flex-col gap-2 justify-end mt-2 sm:mt-0">
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="text-sm border border-green-600 text-green-500 py-2 px-4 rounded text-nowrap">
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-sm  border border-green-500 text-green-500  py-2 px-4 rounded hover:bg-green-600 hover:text-white transition-all duration-300 text-nowrap"
                  >
                    Pay Online
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm border border-red-500 text-red-500 py-2 px-4 rounded hover:bg-red-600 hover:text-white transition-all duration-300 text-nowrap"
                  >
                    Cancel Appointment
                  </button>
                )}

                {item.cancelled && !item.isCompleted && (
                  <button className="text-sm border border-red-500 text-red-500 py-2 px-4 rounded  transition-all duration-300 text-nowrap">
                    Appointment cancelled
                  </button>
                )}
                {item.isCompleted &&(
                    <button className="text-sm border border-green-500 text-green-500 py-2 px-4 rounded  transition-all duration-300 text-nowrap">
                      Completed
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
