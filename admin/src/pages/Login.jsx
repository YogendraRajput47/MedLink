import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DoctorContext } from "../context/DoctorContext";
gsap.registerPlugin();

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext);
  const imageRef = useRef();
  const formRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: 100 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
    );

     gsap.fromTo(
       formRef.current,
       { opacity: 0, y: -100 },
       { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
     );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/admin/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      }else{
        const { data } = await axios.post(`${backendUrl}/doctor/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          console.log(data.token);
          toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div  className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white max-w-4xl w-full">
        {/* Left Image Section */}
        <div
          ref={imageRef}
          className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 to-blue-500 items-center justify-center p-10"
        >
          <img
            src={assets.patients_icon}
            alt="Login Visual"
            className="rounded-xl shadow-2xl object-cover w-full h-full"
          />
        </div>
        {/* Right Form Section */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-8 md:w-1/2 w-full text-gray-600"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            <span className="text-primary">{state}</span> Login
          </h2>

          {/* Email */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Login Button */}
          <button className="w-full py-3 text-white text-base bg-primary rounded-md mt-2 hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg">
            Login
          </button>

          {/* Toggle between Admin/Doctor */}
          {state === "Admin" ? (
            <p className="text-center text-sm mt-2">
              Doctor Login?{" "}
              <span
                className="text-primary cursor-pointer underline"
                onClick={() => setState("Doctor")}
              >
                Click here
              </span>
            </p>
          ) : (
            <p className="text-center text-sm mt-2">
              Admin Login?{" "}
              <span
                className="text-primary cursor-pointer underline"
                onClick={() => setState("Admin")}
              >
                Click here
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
