const { checkSchema } = require("express-validator")
const validateComment = checkSchema({
    title:{trim:true,notEmpty:true,errorMessage:"Title is required"},
    comment:{trim:true,notEmpty:true,errorMessage:"Comment is required"}
})

module.exports = {validateComment};