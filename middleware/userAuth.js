const jwt = require("jsonwebtoken")
const User = require("../Models/UserSchema")

async function userAuth(req,res,next){
    //const token = req.header("x-auth-token")
    const token = req.cookies["x-auth-token"]  
     
       if(token){
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
       const userId=decoded._id;
       const user = await User.findById(userId);
       const userName = user.firstName
       res.locals.userId=userId;
       res.locals.user =userName.charAt(0).toUpperCase()+ userName.slice(1)
       return  next(); 
       }
       res.locals.user = null
        next();
   
} 

module.exports= userAuth