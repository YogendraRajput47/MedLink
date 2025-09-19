import React, { useContext, useEffect, useState, useRef } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DoctorProfile = () => {
  const { dToken, backendUrl, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const containerRef = useRef(null);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        availabel: profileData.availabel,
      };

      const { data } = await axios.put(
        `${backendUrl}/doctor/update-profile`,
        { ...updateData },
        { headers: { dToken } }
      );

      if (data.success) {
        setIsEdit(false);
        getProfileData();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  // ✅ GSAP animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        ".section",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [profileData,profileData.length]);

  return (
    profileData && (
      <div
        ref={containerRef}
        className="profile mt-0 min-h-screen max-h-screen w-full mx-auto bg-white shadow-2xl p-10 text-sm mb-10"
      >
        {/* Top Section */}
        <div className="section flex flex-col sm:flex-row items-center gap-6 border-b border-gray-200 pb-6">
          <img
            src={profileData?.image}
            alt={profileData?.name}
            className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white"
          />
          <div>
            <h1 className="font-semibold text-3xl text-gray-800">
              {profileData?.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {profileData?.degree} - {profileData?.speciality}
            </p>
            <span className="inline-block mt-1 px-3 py-1 text-xs border rounded-full">
              {profileData?.experience} experience
            </span>
          </div>
        </div>

        {/* About Section */}
        <div className="section mt-8">
          <h2 className="text-primary font-semibold text-lg border-b pb-2">
            About
          </h2>
          <p className="text-gray-600 font-medium mt-3">{profileData?.about}</p>
        </div>

        {/* Fees & Availability */}
        <div className="section mt-10">
          <h2 className="text-primary font-semibold text-lg border-b pb-2">
            Clinic Information
          </h2>
          <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-5 text-gray-700">
            <p className="font-medium">Fees:</p>
            {isEdit ? (
              <input
                type="number"
                value={profileData.fees}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, fees: e.target.value }))
                }
                className="bg-gray-50 rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-gray-600">
                {currency}
                {profileData?.fees}
              </p>
            )}

            <p className="font-medium">Available:</p>
            {isEdit ? (
              <input
                type="checkbox"
                checked={profileData.availabel}
                onChange={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    availabel: !prev.availabel,
                  }))
                }
                className="w-5 h-5"
              />
            ) : (
              <p className="text-gray-600">
                {profileData?.availabel ? "Yes" : "No"}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="section mt-10">
          <h2 className="text-primary font-semibold text-lg border-b pb-2">
            Address
          </h2>
          <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-5 text-gray-700">
            <p className="font-medium">Clinic Address:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={profileData.address.line1}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className="bg-gray-50 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={profileData.address.line2}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  className="bg-gray-50 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ) : (
              <div className="text-gray-600">
                <p>{profileData?.address?.line1}</p>
                <p>{profileData?.address?.line2}</p>
              </div>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="section mt-12 w-full flex sm:justify-end sm:-mt-10 text-center">
          {isEdit ? (
            <button
              onClick={updateProfile}
              className="text-primary border border-primary px-10 py-3 rounded-full shadow hover:bg-primary/90 hover:text-white  transition-all duration-200"
            >
              Save Information
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="text-primary border border-primary px-10 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
