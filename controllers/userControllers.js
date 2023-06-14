const User = require("../Models/UserSchema")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const _ = require('lodash')

const getUser = async (req, res) => {
    try {
        const user= await User.findById(req.user._id).select("-password")
    if(!user) return res.status(400).json("User not found")
    res.json(user)
    } catch (error) {
        res.status(400).send(error.message);
    }
    
}  

// Get login form
const loginForm =(req,res)=>{
    res.render('login.ejs')
} 
// Register a person
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    let user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (user) return res.json("Email already exist");
    // Using bcrypt
    const saltRounds = 10;
    const myPassword = password;
    try {
        const hashPassord = await bcrypt.hash(myPassword, saltRounds)
        user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassord
        })
        
        const newUser = await user.save();
        const token =jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{ expiresIn: '3m' })

        res.cookie("x-auth-token",token,{maxAge:60*3*1000,httpOnly:true}).json(newUser)
       // res.header("x-auth-token",token).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

}

// Login user
const login = async (req, res) => {
  
    let user = await User.findOne({ email: new RegExp(`^${req.body.email}$`, 'i') });
    if (!user) return res.status(400).json("Invalid email or password ")
    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) return res.status(400).json("Invalid email or password")
    
    const token =jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{ expiresIn: '3m' })

     res.cookie("x-auth-token",token,{maxAge:1000*60*3,httpOnly:true}).redirect("/user/me")
       
}


//Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find({});
    if (!users) return res.json("There are no user in the database")
    res.json(users);
}


module.exports = { register, getUser, getAllUsers, login,loginForm } 