const jwt = require("jsonwebtoken")

function auth(req,res,next){
    //const token = req.header("x-auth-token")
    const token = req.cookies["x-auth-token"]
    
    if(!token){
        console.log("Access denied: No token provided");
       return res.status(401).send("Access denied: No token provided");
    } 
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decoded;
        next(); 
    } catch (ex) {
        console.log(ex.message)
        res.status(400).send("Invalid token")
    }
} 

module.exports= auth