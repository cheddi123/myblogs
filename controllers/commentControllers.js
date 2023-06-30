const { body, validationResult } = require("express-validator")
const Comment = require("../Models/CommentsSchema")
const UserComment = require("../Models/UserCommentSchema")
const { json } = require("express")


// Post a new comment
const postComment = async (req, res) => {
    //console.log(req.body)
    const result = validationResult(req);

   // console.log(req.user._id)

    try {
        if (!result.isEmpty()) {
            return res.json({ errors: result.array().map(err => err.msg) });
        }
        const comment = new Comment({
            title: req.body.title,
            comment: req.body.comment,
            userId: req.user._id
        })
        const mycomment = await comment.save()
        res.json(mycomment)
    } catch (error) {
        res.status(400).send(error.message)
    }


}
// Get all comments 
const allComments = async (req, res) => {
    try {
        const allComments = await Comment.find({}).sort({updatedAt:-1}).populate("userId", ["firstName", "lastName"]).exec()
        // console.log(allComments)
        //const auth=req.cookies["x-auth-token"]
        //console.log(req.cookies["x-auth-token"])
        if (allComments.length == 0) return res.json("There are no comments at the moment");
       // console.log(allComments);
        res.render("comments.ejs", { allComments })
        //res.json(allComments);
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
}

// Get a comment by ID
const commentById = async (req, res) => {
    const id = req.params.id
    try {
        const comment = await Comment.findById(id).populate("userId", ["_id","firstName", "lastName"]).populate({path:"usercomment",populate:{path:"userId",model:"user",select:'firstName lastName'}}).exec()
        if (comment == null) throw new Error("Comment cannot be found")
        //res.json(comment)
        console.log(comment)
        res.render("viewComment.ejs",{comment})
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}

// Update a blog by adding a comment 
const userComment =async (req, res) => {
    console.log(req.body)
    const result = validationResult(req);

    console.log(req.user._id)

    try {
        if (!result.isEmpty()) {
            return res.json({ errors: result.array().map(err => err.msg) });
        }
       let userComment = new UserComment({
            userComment: req.body.userComment,
            userId: req.user._id,
            commentId:req.params.commentID
        });
        await userComment.save()
        //console.log(userComment)
        const commentID= req.params.commentID
        let comment =await  Comment.findByIdAndUpdate(commentID,{$push:{usercomment:userComment._id}},{new:true});
        console.log(comment)
        //res.json(comment)
        res.redirect(`/comment/${commentID}`)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// Get ALL users comments of  a comment/blog
const allCommentsBlog = async (req, res) => {
    const id = req.params.commentID
    try {
        const comment = await Comment.findById(id).populate({path:"usercomment",populate:{path:"userId",model:"user",select:'firstName lastName'}})
        if (comment == null) throw new Error("Comment cannot be found")
        
        //console.log(JSON.stringify(comment)) 
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
        const comments = await Comment.find({ userId: userId }).populate("userId", ["firstName", "lastName", "email"])
        if (comments == null) throw new Error("Comment cannot be found")
        res.json(comments)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}

// Delete a comment by the user who made the comment
const deleteComment = async (req, res) => {
    const userId = req.user._id
    const comment = await Comment.findById(req.params.id)

    try {
        if (comment == null) throw new Error("Comment cannot be found")
        if (userId == comment.userId._id) {
            
         const deletedComment=   await Comment.findByIdAndDelete(req.params.id)
          await UserComment.deleteMany({commentId:deletedComment._id})
            return res.redirect("/comment/all")
        } else {
            throw new Error("Unauthorized to delete this comment")
        }
 

    } catch (error) {
        res.status(400).send(error.message)
    }
}

// Edit a comment

const updateComment = async (req, res) => {

    try {
        const userId = req.user._id
        // console.log(userId)
        let comment = await Comment.findById(req.params.id)
        if (userId == comment.userId._id) {

            comment = await Comment.findByIdAndUpdate(req.params.id, {
                $set: {
                    title: req.body.title,
                    comment: req.body.comment
                }
            }, { new: true })
            console.log(comment)
            return res.redirect("/comment/all")
        } else {
            throw new Error("Unauthorized to update this comment")
        }


    } catch (error) {
        res.status(403).send(error.message)
    }
}

// Get comment form
const getForm = (req, res) => {
    res.render("commentForm.ejs")
}
// Get edit comment form
const getEditCommentForm = async(req,res)=>{
    const comment=await Comment.findById(req.params.id)

    res.render("editCommentForm.ejs",{comment})
}

module.exports = { postComment, allComments, commentById, userComments, getForm, deleteComment, updateComment,userComment,allCommentsBlog,getEditCommentForm} 