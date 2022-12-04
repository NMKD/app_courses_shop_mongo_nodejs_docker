const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        layout: 'home',
        title: "Купить курс Java Script & NodeJS",
        isHome: true
    })
})

module.exports = router