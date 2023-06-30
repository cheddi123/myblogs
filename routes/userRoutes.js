const express = require('express');
const router = express.Router()
const {register,getUser,getAllUsers,login,loginForm,logOut,registerForm}= require("../controllers/userControllers")
const auth=require("../middleware/auth")

router.post("/register",register );
router.post("/login",login); 
router.get('/form',loginForm);
router.get("/all",getAllUsers);
router.get("/me",auth,getUser);
router.get("/logOut",logOut)
router.get("/register",registerForm)


module.exports=router;