const { Router } = require('express')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findById('637bd0d10e406befd3a41a7e')
    req.session.user = user
    req.session.isAuthenticated = true
    // чтобы успели данные попасть в сессию до того, как произойдет render на главную страницу, сохраняем сессию method save
    req.session.save(err => {
        if (err) {
            throw err
        }
        res.redirect('/')
    })
})


module.exports = router