const { body, validationResult } = require("express-validator")
const Comment = require("../Models/CommentsSchema")


// Post a new comment
const postComment = async (req, res) => {
    console.log(req.body)   
    const result = validationResult(req);
    
    console.log(req.user._id)

    try {
        if (!result.isEmpty()) {
            return res.json({ errors: result.array().map(err=>err.msg) });
        }
        const comment = new Comment({
            title: req.body.title,  
            comment: req.body.comment,
            userId: req.user._id
        })
        const mycomment = await comment.save()
        res.json(mycomment)
    } catch (error) {
        res.status(400).send("Could not save to DB")
    }
  
    
}
// Get all comments 
const allComments = async (req, res) => {
    try {
        const allComments = await Comment.find({}).populate("userId",["firstName","lastName"]).exec()
        console.log(allComments)
        if (allComments.length == 0) return res.json("There are no comments at the moment")
        res.render("comments.ejs",{allComments})
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
}

// Get a comment by ID
const commentById = async (req, res) => {
    const id = req.params.id
    try {
        const comment = await Comment.findById(id)
        if (comment == null) throw new Error("Comment cannot be found")
        res.json(comment)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}

// Get all comments by a particular user
const userComments = async (req, res) => {
    const userId = req.user._id

    try {
        const comments = await Comment.find({userId:userId}).populate("userId",["firstName","lastName","email"])
        if (comments == null) throw new Error("Comment cannot be found")
        res.json(comments)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}

// Delete a comment by the user who made the comment
const deleteComment = async(req,res)=>{
    const userId = req.user._id
    const comment = await Comment.findById(req.params.id)
    try {
        await Comment.findByIdAndDelete(req.params.id)

        
    } catch (error) {
        
    }
}

// Get comment form
const getForm =(req,res)=>{
    res.render("commentForm.ejs")
}

module.exports = { postComment, allComments, commentById,userComments,getForm} 