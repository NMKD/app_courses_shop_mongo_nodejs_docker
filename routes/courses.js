const { Router } = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Course.find()
    console.log(courses)
    res.render('courses', {
        title: "Список курсов",
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    res.render('edit', {
        title: `Редактировать курс ${course.title}`,
        course
    })
})

router.post('/edit', async (req, res) => {
    const { id } = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.post('/delete', async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    // console.log(course)
    res.render('course', {
        layout: 'emty',
        title: `Курс ${course.title}`,
        course
    })
})

module.exports = router