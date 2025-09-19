const jwt=require('jsonwebtoken');

//admin authenctication middleware to verify JWT tokens

exports.authAdmin=async (req,res,next)=>{
    try {
        const {atoken}=req.headers;
        if(!atoken){
            return res.status(401).json({ success: false, message: 'Not Authroized login again' });
        }
        const decodedToken=jwt.verify(atoken,process.env.JWT_SECRET);

        if(decodedToken!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.status(401).json({ success: false, message: 'Not Authroized login again' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

