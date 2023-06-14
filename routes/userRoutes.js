const express = require('express');
const router = express.Router()
const {register,getUser,getAllUsers,login,loginForm}= require("../controllers/userControllers")
const auth=require("../middleware/auth")

router.post("/register",register );
router.post("/login",login);
router.get('/form',loginForm);
router.get("/all",getAllUsers);
router.get("/me",auth,getUser);

module.exports=router;