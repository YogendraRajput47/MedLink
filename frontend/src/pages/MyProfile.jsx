import React, { useState, useRef, useContext } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import { toast } from "react-toastify";
import axios from "axios";
const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.from(containerRef.current, {
      opacity: 0,
      y: 100,
      duration: 0.8,
    }).from(
      containerRef.current.querySelectorAll(".section"),
      {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
      },
      "-=0.3"
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);
      const { data } = await axios.put(
        `${backendUrl}/user/update-profile`,
        formData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      ref={containerRef}
      className="mt-24 max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-10 text-sm"
    >
      {/* Top Section */}
      <div className="section flex items-center gap-6 border-b border-gray-200 pb-6 ">
        {isEdit ? (
          <label
            htmlFor="image"
            className="cursor-pointer group inline-block relative"
          >
            {/* Profile Image */}
            <img
              className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white group-hover:opacity-75 transition duration-300"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <img
                src={assets.upload_icon}
                alt="Upload"
                className="w-10 h-10"
              />
            </div>

            {/* Hidden input */}
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            src={userData?.image}
            alt={userData?.name}
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
        )}
        <div>
          {isEdit ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="bg-gray-50 text-3xl font-semibold text-gray-800 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <h1 className="font-semibold text-3xl text-gray-800">
              {userData?.name}
            </h1>
          )}
          <p className="text-gray-500 mt-1">{userData?.email}</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="section mt-8">
        <h2 className="text-primary font-semibold text-lg border-b pb-2">
          Contact Information
        </h2>
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-5 text-gray-700">
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="bg-gray-50 rounded px-2 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <p className="text-blue-500">{userData?.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div className="space-y-2">
              <input
                type="text"
                value={userData.address.line1}
                className="bg-gray-50 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <input
                type="text"
                value={userData.address.line2}
                className="bg-gray-50 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </div>
          ) : (
            <div className="text-gray-500">
              <p>{userData?.address?.line1}</p>
              <p>{userData?.address?.line2}</p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="section mt-10">
        <h2 className="text-primary font-semibold text-lg border-b pb-2">
          Basic Information
        </h2>
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-5 text-gray-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="bg-gray-50 rounded px-2 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={handleChange}
              name="gender"
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData?.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleChange}
              className="bg-gray-50 rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <p className="text-gray-500">{userData?.dob}</p>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="section mt-12 text-center">
        {isEdit ? (
          <button
            type="submit"
            className="text-white bg-primary px-10 py-3 rounded-full shadow hover:bg-primary/90 transition-all duration-200"
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button
            className="text-primary border border-primary px-10 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-200"
            onClick={() => setIsEdit(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
