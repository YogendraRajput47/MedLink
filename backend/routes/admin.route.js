const express = require("express");
const upload = require("../middlewares/multer");
const adminRouter = express.Router();

//Importing the middleware for authentication
const { authAdmin } = require("../middlewares/authAdmin");

// Importing the controllers
const {
  addDoctor,
  adminLogin,
  getAllDoctors,
  getAllAppointments,
  cancelUserAppointment,
  adminDashboard
} = require("../controllers/admin.controller");

const {changeDoctorAvailability}=require("../controllers/doctor.controller");

adminRouter.post("/login", adminLogin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, getAllDoctors);
adminRouter.put("/change-availability", authAdmin, changeDoctorAvailability);
adminRouter.get("/appointments", authAdmin, getAllAppointments);
adminRouter.put("/cancel-appointment", authAdmin, cancelUserAppointment);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
module.exports = adminRouter;
