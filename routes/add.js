const { Router } = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: "Добавить курс",
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
    })

    try {
        await course.save()
        console.log(course)
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router