const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// changeDoctorAvailability controller

exports.changeDoctorAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctorDetails = await Doctor.findById(docId);
    await Doctor.findByIdAndUpdate(docId, {
      availabel: !doctorDetails.availabel,
    });

    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//fetAllDoctors controller
exports.fetAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//doctorLogin controller
exports.doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if all fields are provided
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    //check if user exists and password is correct
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    //validate password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    //generate JWT token
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    //return response with success message
    res.json({ success: true, token, message: "Logged In" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//getAllDoctorAppointments controller
exports.getAllDoctorAppointments = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await Appointment.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//markAppointmentCompleted controllers
exports.markAppointmentCompleted = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
      res.json({ success: true, message: "Appointment completed" });
    } else {
      res.json({ success: false, message: "Marked Failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//cancelAppointment controller
exports.cancelAppointment = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
      res.json({ success: true, message: "Appointment cancelled" });
    } else {
      res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//getDoctorDashData controller

exports.getDoctorDashData = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await Appointment.find({ docId });
    let earnings = 0;

    appointments.forEach((appointment) => {
      if (
        appointment.isCompleted ||
        (appointment.payment && !appointment.cancelled)
      ) {
        earnings += appointment.amount;
      }
    });
    let patients=[];
    appointments.forEach((appointment) => {
      if (!patients.includes(appointment.userId)) {
        patients.push(appointment.userId);
      }
    });

    const dashData={
      earnings: earnings,
      totalAppointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    }
    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//getDoctorProfile controller

exports.getDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const profileData = await Doctor.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


//updateDoctorProfile controller
exports.updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const {fees,address,availabel}=req.body;

    await Doctor.findByIdAndUpdate(docId, { fees,address,availabel });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

