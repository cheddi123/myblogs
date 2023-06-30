const express = require('express');
const { body, validationResult,checkSchema } = require("express-validator")
const routes = express.Router();
const { postComment, allComments, commentById,userComments,getForm,deleteComment,updateComment,userComment,allCommentsBlog,getEditCommentForm} = require("../controllers/commentControllers")
const {validateComment,validateUserComment}= require("../validation/validate")
const auth= require('../middleware/auth')

// Another way to use validator 
const validator =

   [body("title", "Title is required").trim().notEmpty(), 
    body("comment", "Comment is required").trim().notEmpty()];
    

routes.post("/new",auth, validateComment, postComment)

// Get all comments
routes.get("/all", allComments)

// find a comment by ID
routes.get("/:id",auth, commentById)

// find all commments by user

routes.get("/user/all",auth,userComments)

// Get comment form
routes.get("/new/form",getForm)

//Delete a comment by ID 
routes.delete("/:id",auth,deleteComment);

// Update comment by ID
routes.post("/:id",auth,updateComment);

// Update a commen by ID and user ID by adding a user comment
routes.put("/user/:commentID",auth,validateUserComment, userComment)

// Get all comments of a blog
routes.get("/user/:commentID",allCommentsBlog)

// Get Edit Comment Form 
routes.get("/edit/:id",getEditCommentForm)

 
module.exports = routes  