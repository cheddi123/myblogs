const mongoose = require("mongoose")

const UserCommentSchema = new mongoose.Schema({
    userComment: {type:String,required:true},
    userId :{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    commentId :{type:String}
    
   
}, { timestamps: true });

const userComment = mongoose.model("usercomment", UserCommentSchema);

module.exports = userComment;     