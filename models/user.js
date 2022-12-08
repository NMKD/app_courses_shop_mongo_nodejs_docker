const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items]
    const i = items.findIndex(c => c.courseId.toString() === course._id.toString())

    if (i >= 0) {
        items[i].count++
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    this.cart = { items }
    return this.save()
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items]
    const i = items.findIndex(c => c.courseId.toString() === id.toString())

    if (items[i].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[i].count--
    }

    this.cart = { items }
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save()
}

module.exports = model("User", userSchema)