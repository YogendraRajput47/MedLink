const jwt = require("jsonwebtoken");

// user authentication middleware
exports.authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authroized login again" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
