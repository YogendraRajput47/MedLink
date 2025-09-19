const express = require("express");
const doctorRouter = express.Router();

const {
  fetAllDoctors,
  doctorLogin,
  getAllDoctorAppointments,
  markAppointmentCompleted,
  cancelAppointment,
  getDoctorDashData,
  getDoctorProfile,
  updateDoctorProfile
} = require("../controllers/doctor.controller");
const { authDoctor } = require("../middlewares/authDoctor");

// routes
doctorRouter.get("/list", fetAllDoctors);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appointments", authDoctor,getAllDoctorAppointments);
doctorRouter.put("/complete-appointment", authDoctor, markAppointmentCompleted);
doctorRouter.put("/cancel-appointment", authDoctor, cancelAppointment);
doctorRouter.get("/dashboard", authDoctor, getDoctorDashData);
doctorRouter.get("/profile", authDoctor, getDoctorProfile);
doctorRouter.put("/update-profile", authDoctor, updateDoctorProfile);


module.exports = doctorRouter;
