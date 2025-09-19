const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const Appointment = require("../models/appointment.model");

//addDoctor controller
exports.addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // check doctor details
    const doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    //check if image file exists
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image file" });
    }

    //verify every field
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required details" });
    }
    //check email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email" });
    }
    //check password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 8 characters long",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary
    const imageUplaod = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUplaod.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//admin login controller
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check email and password
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      return res.status(200).json({
        success: true,
        token,
        message: "Admin logged in successfully",
      });
    }

    res.json({ success: false, message: "Invalid Credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//getAllDoctors controller
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// getAllAppointments controller
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//cancelUserAppointment controller
exports.cancelUserAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
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

//adminDashboard controller
exports.adminDashboard = async (req,res) => {
  try {
    const doctors = await Doctor.find({});
    const users = await User.find({});
    const appointments = await Appointment.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
