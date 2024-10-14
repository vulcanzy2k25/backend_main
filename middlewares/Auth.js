const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.auth = async(req,res,next)=>{
    try{
        const token= req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "").replace(/"/g, '');

        if(!token){
            return res.status(500).json({
                success: false,
                message: "token is missing"
            });
        }

        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decode
            
        }catch(error){
            return res.status(500).json({
                success: false,
                message: "Error jwt verification",
            });

        }
        next();
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Unable to Auth",
			error: error.message,
		});
    }

}