const jwt = require("jsonwebtoken");

const authMiddleware = (req,res ,next)=>{
    const authHeader = req.headers['authorization'];

    // console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Access denied, no token ,please login again"
        });
    };

    try{
        const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decodeTokenInfo);
        
        req.userInfo = decodeTokenInfo; //as we are passing before next() so the req object will carry it to the next middleware/function
        next();
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : "Access denied, wrong token ,please login again"
        });
    }
}

module.exports = authMiddleware;
