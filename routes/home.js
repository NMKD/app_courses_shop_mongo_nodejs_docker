const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: "Купить курс по программированию",
        isHome: true
    })
})

module.exports = router