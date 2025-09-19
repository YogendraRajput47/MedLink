const cloudinary = require("cloudinary").v2;


const connectToCloudinary = async () => {
  try {
     cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.ClOUDINARY_SECRET_KEY,
    });
  } catch (error) {
    console.error("Error connecting to Cloudinary:", error);
  }
};

module.exports = connectToCloudinary;