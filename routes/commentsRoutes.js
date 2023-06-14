const express = require('express');
const { body, validationResult,checkSchema } = require("express-validator")
const routes = express.Router();
const { postComment, allComments, commentById,userComments,getForm } = require("../controllers/commentControllers")
const {validateComment}= require("../validation/validate")
const auth= require('../middleware/auth')

// Another way to use validator 
const validator =

   [body("title", "Title is required").trim().notEmpty(), 
    body("comment", "Comment is required").trim().notEmpty()];
    

routes.post("/new",auth, validateComment, postComment)

// Get all comments
routes.get("/all", allComments)

// find a comment by ID
routes.get("/:id", commentById)

// find all commments by user

routes.get("/user/all",auth,userComments)

// Get comment form
routes.get("/new/form",getForm)

 
module.exports = routes 