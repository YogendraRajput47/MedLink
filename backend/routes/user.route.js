const express = require("express");
const userRouter = express.Router();
const upload = require("../middlewares/multer");

// Importing the controllers
const {
  registerUser,
  userLogin,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointments,
  cancelDoctorAppointment,
  makePayment,
  verifyPayment
} = require("../controllers/user.controller");
const { authUser } = require("../middlewares/authUser");

// routes
userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.put(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateUserProfile,
);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointments);
userRouter.put("/cancel-appointment",authUser, cancelDoctorAppointment);
userRouter.post("/payment-razorpay", authUser, makePayment);
userRouter.post("/verify-razorpay", authUser, verifyPayment);

module.exports = userRouter;
