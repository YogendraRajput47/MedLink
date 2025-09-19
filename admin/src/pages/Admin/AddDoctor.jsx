

import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(); 

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    docImg: false,
    name: "",
    email: "",
    password: "",
    experience: "1 Year",
    fees: "",
    about: "",
    speciality: "General Physician",
    degree: "",
    address1: "",
    address2: "",
  });

    const formRef = useRef  (null);

   useGSAP(() => {
     gsap.from(formRef.current, {
       x: 100,
       opacity: 0,
       duration: 1,
       ease: "power4.out",
     });
     gsap.from(formRef.current.children, {
       opacity: 0,
       y: 20,
       duration: 0.8,
       stagger: 0.1,
       ease: "power3.out",
       delay: 0.2,
     });
   }, []);

  const { backendUrl, aToken } = useContext(AdminContext);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.docImg) {
        return toast.error("Please upload a doctor's image");
      }

      const doctorFormData = new FormData();
      doctorFormData.append("image", formData.docImg);
      doctorFormData.append("name", formData.name);
      doctorFormData.append("email", formData.email);
      doctorFormData.append("password", formData.password);
      doctorFormData.append("experience", formData.experience);
      doctorFormData.append("fees", formData.fees);
      doctorFormData.append("about", formData.about);
      doctorFormData.append("speciality", formData.speciality);
      doctorFormData.append("degree", formData.degree);
      doctorFormData.append(
        "address",
        JSON.stringify({
          line1: formData.address1,
          line2: formData.address2,
        })
      );

      const { data } = await axios.post(
        `${backendUrl}/admin/add-doctor`,
        doctorFormData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setFormData({
          docImg: false,
          name: "",
          email: "",
          password: "",
          experience: "1 Year",
          fees: "",
          about: "",
          speciality: "General Physician",
          degree: "",
          address1: "",
          address2: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <form  onSubmit={handleSubmit} className="m-5 w-full max-w-6xl" ref={formRef}>
      <p className="mb-5 text-2xl font-semibold text-gray-800">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded-2xl shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-5 mb-10 text-gray-600 ">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-20 h-20 rounded-full object-cover border-2  shadow-md  hover:scale-105 border-dashed border-gray-300 hover:border-primary transition"
              src={
                formData.docImg
                  ? URL.createObjectURL(formData.docImg)
                  : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, docImg: e.target.files[0] }))
            }
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-sm text-gray-500">
            Upload doctor's <br /> profile picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-700">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium">Doctor Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Name"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Doctor Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Doctor Password</label>
              <input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year${i > 0 ? "s" : ""}`}>
                    {i + 1} Year{i > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Fees</label>
              <input
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium">Speciality</label>
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Education</label>
              <input
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Education"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Address</label>
              <input
                name="address1"
                value={formData.address1}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mt-6 mb-2 font-medium">About Doctor</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            className="px-4 pt-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write about doctor"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="px-10 py-3 bg-primary text-white rounded-full mt-6 hover:bg-secondary transition-all duration-300 shadow-md"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
