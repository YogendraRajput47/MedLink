import React, { useState, useEffect, useRef, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import gsap from "gsap";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate=useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { name, email, password, confirmPassword } = formdata;
  const formRef = useRef(null);
  const { backendUrl, token, setToken } = useContext(AppContext);

  useEffect(() => {
    gsap.from(formRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, [state]);

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword && state === "Sign Up") {
      toast.error("Passwords do not match");
      return;
    }

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(
          `${backendUrl}/user/register`,
          formdata
        );
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/user/login`, {
          email: formdata.email,
          password: formdata.password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(()=>{
    if(token){
      navigate("/");
    }
  },[token])

  return (
    <div className="mt-24 pb-20 flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="min-h-[80vh] flex items-center w-full px-4"
      >
        <div
          ref={formRef}
          className="flex flex-col gap-4 m-auto items-start p-10 sm:min-w-96 w-full max-w-md
          border rounded-2xl text-zinc-700 text-sm shadow-2xl
          backdrop-blur-md bg-white/80"
        >
          <p className="text-3xl font-semibold text-gray-800">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p className="text-gray-500">
            Please{" "}
            {state === "Sign Up"
              ? "sign up to book appointment"
              : "login to book appointment"}
          </p>

          {state === "Sign Up" && (
            <div className="w-full">
              <label className="block">Full Name</label>
              <input
                required
                type="text"
                value={name}
                name="name"
                placeholder="Enter your Name"
                onChange={handleChange}
                className="border-b border-zinc-300 rounded-md w-full p-2 mt-1
                focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div className="w-full">
            <label className="block">Email</label>
            <input
              required
              type="email"
              value={email}
              name="email"
              placeholder="Enter your Email"
              onChange={handleChange}
              className="border-b border-zinc-300 rounded-md w-full p-2 mt-1
              focus:outline-none focus:border-primary"
            />
          </div>

          <div className="w-full relative">
            <label className="block">Password</label>
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              className="border-b border-zinc-300 rounded-md w-full p-2 mt-1
              focus:outline-none focus:border-primary"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-zinc-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {state === "Sign Up" && (
            <div className="w-full relative">
              <label className="block">Confirm Password</label>
              <input
                required
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                name="confirmPassword"
                placeholder="Enter Confirm Password"
                onChange={handleChange}
                className="border-b border-zinc-300 rounded-md w-full p-2 mt-1
                focus:outline-none focus:border-primary"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-9 text-zinc-500 cursor-pointer"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 text-white text-base bg-primary rounded-md mt-4 
            hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>

          {state === "Sign Up" ? (
            <p className="w-full text-center text-sm">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-primary underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="w-full text-center text-sm">
              Create a new account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-primary underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
