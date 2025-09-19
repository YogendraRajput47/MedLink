const  jwt=require('jsonwebtoken');

exports.authDoctor = async (req, res, next) => {
  try {
    const {dtoken} = req.headers;
    if (!dtoken) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authroized login again" });
    }
    const decodedToken = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.docId = decodedToken.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
