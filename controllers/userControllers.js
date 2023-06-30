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
    const message = req.flash("error")
    // console.log(message)
    res.render('login.ejs',{message}) 
} 

// Get register form 
const registerForm =(req,res)=>{
    const message = req.flash("error")
    // console.log(message)
    res.render('registerForm.ejs',{message}) 
}
// Register a person
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    
    let user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    //if (user) return res.json("Email already exist");
    if (user) {
        req.flash("error","Email already exist")
      return res.redirect("/user/register");  
    } 
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
        const token =jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{ expiresIn: '10m' });

        res.cookie("x-auth-token",token,{maxAge:60*10*1000,httpOnly:true}).redirect("/comment/all")
       // res.header("x-auth-token",token).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message) 
    }

}

// POST Login user
const login = async (req, res) => {
  
    let user = await User.findOne({ email: new RegExp(`^${req.body.email}$`, 'i') });
    if (!user) {
        req.flash("error","Invalid email or password")
        return res.status(400).redirect("/user/form")
    } 
    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid){
        req.flash("error","Invalid email or password")
      return res.status(400).redirect("/user/form")   
    } 

    const token =jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{ expiresIn:'10m' })

     res.cookie("x-auth-token",token,{maxAge:1000*60*10,httpOnly:true}).redirect("/comment/all")
       
}


//Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find({});
    if (!users) return res.json("There are no user in the database")
    res.redirect("/comment/all");
}

const logOut =(req,res)=>{
    res.cookie("x-auth-token","",{maxAge:100})
    res.redirect("/user/form")
}
module.exports = { register, getUser, getAllUsers, login,loginForm,logOut,registerForm } 