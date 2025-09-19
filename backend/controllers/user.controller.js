const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;
const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");
const { razorpayInstance } = require("../config/razorpay");
//registerUser controller

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    //check if all fields are provided
    if (!name || !email || !password || !confirmPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    //validate password
    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    //validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    //validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be at least 8 characters long",
      });
    }

    //check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user instance and save to database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    //generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    //return response with success message
    res.json({ success: true, token, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//userLogin controller

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if all fields are provided
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    //validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    //generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, message: "Logged In" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//getUserProfile controller
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//updateUserProfile controller
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "All fields are required" });
    }

    let parseAddress = JSON.parse(address);
    //update user data
    const userData = {
      name,
      phone,
      address: parseAddress,
      dob,
      gender,
    };

    if (imageFile) {
      //upload image to cloudinary
      const imageUplaod = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUplaod.secure_url;
      //update user image
      userData.image = imageUrl;
    }
    await User.findByIdAndUpdate(userId, userData, { new: true });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//bookAppointment controller

exports.bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;
    const docData = await Doctor.findById(docId).select("-password");

    if (!docData.availabel) {
      return res.json({
        success: false,
        message: "Doctor is not available at this time",
      });
    }
    let slotsBooked = docData.slotsBooked;

    //checking for slots Availability
    if (slotsBooked[slotDate]) {
      if (slotsBooked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not availabel",
        });
      } else {
        slotsBooked[slotDate].push(slotTime);
      }
    } else {
      slotsBooked[slotDate] = [];
      slotsBooked[slotDate].push(slotTime);
    }

    const userData = await User.findById(userId).select("-password");
    delete docData.slotsBooked;

    const appointmetData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new Appointment(appointmetData);
    await newAppointment.save();

    //save new slotData to doctor data
    await Doctor.findByIdAndUpdate(docId, { slotsBooked }, { new: true });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await Appointment.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//cancelAppointment controller
exports.cancelDoctorAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await Appointment.findByIdAndUpdate(
      appointmentId,
      { cancelled: true },
      { new: true }
    );

    // releasing doctor slots
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await Doctor.findById(docId).select("-password");
    let slotsBooked = doctorData.slotsBooked;
    slotsBooked[slotDate] = slotsBooked[slotDate].filter(
      (time) => time !== slotTime
    );

    await Doctor.findByIdAndUpdate(docId, { slotsBooked }, { new: true });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//makePayment controller

exports.makePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }
    //creating options for payment gateway
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };
    //making order for payment
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//verifyPayment controller
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await Appointment.findByIdAndUpdate(
        orderInfo.receipt,
        { payment: true },
        { new: true }
      );
      return res.json({ success: true, message: "Payment successful" });
    }else{
      return res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
