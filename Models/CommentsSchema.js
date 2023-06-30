const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    title: {type:String,required:true},
    comment: {type:String,required:true},
    userId :{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    usercomment :[{type:mongoose.Schema.Types.ObjectId,ref:"usercomment"}]
}, { timestamps: true });

const comment = mongoose.model("comment", CommentSchema);

module.exports = comment;      