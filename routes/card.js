const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')

const computePrice = (cousres) => {
   return cousres.reduce((total, course) => {
      return total += course.count * course.price
   }, 0)
}

const mapToCart = (user) => {
    return user.cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId._id,
        count: c.count,
    }))
}

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate(['cart.items.courseId'])
    const cousres = mapToCart(user)
    // console.log(cousres)
    res.render('card', {
        isCard: true,
        title: `Корзина`,
        courses: cousres,
        total: computePrice(cousres)
    })
})

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate(['cart.items.courseId'])
    const cousres = mapToCart(user)
    // console.log(cousres)
    const cart = {
        courses: cousres,
        total: computePrice(cousres)
    }
    res.status(200).json(cart)
})

module.exports = router