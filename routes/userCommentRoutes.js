const express = require('express');
const { body, validationResult,checkSchema } = require("express-validator")
const routes = express.Router();
const {validateUserComment}= require("../validation/validate")
const auth= require('../middleware/auth')

// Get usercomment controllers
const {userComment}= require('../controllers/userCommentControllers')

routes.put("/:commentID/",auth,validateUserComment, userComment)

module.exports=routes