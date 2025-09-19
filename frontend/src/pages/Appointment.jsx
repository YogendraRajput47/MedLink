import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import { FaArrowRight } from "react-icons/fa";
import RelatedDoctors from "../components/RelatedDoctors";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "react-toastify";
import axios from "axios";
gsap.registerPlugin(useGSAP);

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, backendUrl, token, getAllDoctors } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [doctorInfo, setDoctorInfo] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // ----- GSAP Refs -----
  const doctorCardRef = useRef();
  const slotDatesRef = useRef();
  const slotTimesRef = useRef();
  useGSAP(() => {
    if (doctorCardRef.current) {
      gsap.fromTo(
        doctorCardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }

    if (slotDatesRef.current && slotDatesRef.current.children.length > 0) {
      gsap.fromTo(
        slotDatesRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }

    if (slotTimesRef.current && slotTimesRef.current.children.length > 0) {
      gsap.fromTo(
        slotTimesRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.4,
        }
      );
    }
  }, [doctorInfo, doctorSlots]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }
    try {
      const date = doctorSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      if (slotTime === "") {
        toast.error("Please select a slot time");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: {
            token,
          },
        }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchDocInfo = async () => {
    const doctorInfo = await doctors.find((doc) => doc._id === docId);
    setDoctorInfo(doctorInfo);
  };

  const getAvailabelSlots = async () => {
    setDoctorSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();

        if (hour < 10) {
          hour = 10;
          minute = 0;
        } else {
          if (minute > 30) {
            hour += 1;
            minute = 0;
          } else if (minute > 0) {
            minute = 30;
          }
        }
        currentDate.setHours(hour, minute, 0, 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          doctorInfo?.slotsBooked[slotDate] &&
          doctorInfo?.slotsBooked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDoctorSlots((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (doctorInfo && doctorInfo.slotsBooked) {
      getAvailabelSlots();
    }
  }, [doctorInfo]);

  return (
    doctorInfo && (
      <div className="mt-24">
        {/* ---------Doctor Info------------ */}
        <div
          ref={doctorCardRef}
          className="flex flex-col md:flex-row md:flex-1 gap-8"
        >
          <div
            className="relative rounded-lg p-[3px] animate-border-rotate inline-block shadow-xl "
            style={{
              background: `conic-gradient(
                from var(--border-angle),
                #5f6FFF 20deg,
                #5f6FDD 40deg,
                transparent 40deg,
                transparent 360deg
              ) border-box`,
            }}
          >
            <img
              className=" w-full md:max-w-72 h-full rounded-lg hover:scale-105 bg-white  transition-all duration-500 "
              src={doctorInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[30px] sm:mt-0  shadow-xl">
            <p className="flex gap-2 items-center text-2xl font-medium tex-gray-900">
              {doctorInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {doctorInfo.degree} - {doctorInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {doctorInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {doctorInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {doctorInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 pl-4 sm:pl-8 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div
            ref={slotDatesRef}
            className="flex gap-3 items-center w-full overflow-x-scroll mt-4"
          >
            {doctorSlots.length &&
              doctorSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 cursor-pointer rounded-full
                     ${
                       slotIndex == index
                         ? "bg-primary text-white hover:bg-secondary"
                         : "border border-gray-200 hover:border-secondary hover:text-secondary"
                     }  transition-all duration-200`}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div
            ref={slotTimesRef}
            className="flex items-center gap-3 w-full overflow-x-scroll mt-4"
          >
            {doctorSlots.length && doctorSlots[slotIndex].length > 0 ? (
              doctorSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2  rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  } transition-all duration-200`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <div className="px-10 py-3 bg-primary text-white hover:bg-se\">
                No slots availabel for Today
              </div>
            )}
          </div>
          <button
            onClick={bookAppointment}
            className="text-white text-md font-medium bg-primary hover:bg-secondary px-8 py-3 rounded-full transition-all duration-300 flex gap-x-2 items-center hover:scale-105 hover:shadow-xl hover:shadow-gray-300 mt-4"
          >
            Book an Appointment
            <span>
              <FaArrowRight />
            </span>
          </button>
        </div>

        <div>
          <RelatedDoctors docId={docId} speciality={doctorInfo.speciality} />
        </div>
      </div>
    )
  );
};

export default Appointment;
