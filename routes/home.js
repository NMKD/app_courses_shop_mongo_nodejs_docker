const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        layout: 'home',
        title: "Купить курс по программированию",
        isHome: true
    })
})

module.exports = router