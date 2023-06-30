const UserComment = require("../Models/UserCommentSchema")
const { validationResult } = require("express-validator")

// Update a blog by adding a comment 
const userComment =async (req, res) => {
    console.log(req.body)
    const result = validationResult(req);

    console.log(req.user._id)

    try {
        if (!result.isEmpty()) {
            return res.json({ errors: result.array().map(err => err.msg) });
        }
        const comment = new UserComment({
            userComment: req.body.comment,
            userId: req.user._id,
            comment:req.params.commentID
        })
        const mycomment = await comment.save()
        res.json(mycomment)
    } catch (error) {
        res.status(400).send("Could not save to DB")
    }
}



module.exports ={userComment}