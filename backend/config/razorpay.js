const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

exports.razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
