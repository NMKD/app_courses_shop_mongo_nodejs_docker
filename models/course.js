const { Schema, model } = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String ,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})



module.exports = model('Course', course)