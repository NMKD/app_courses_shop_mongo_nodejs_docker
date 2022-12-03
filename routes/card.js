const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', async (req, res) => {
    const card = await Course.find()
    res.render('card', {
        isCard: true,
        title: `Корзина`,
        courses: card.courses,
        priceJson: card.price
    })
    res.json({items: 'course'})
})

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
    // const cart = await Course.deleteOne(req.params.id)
    res.status(200).json(cart)
})

module.exports = router