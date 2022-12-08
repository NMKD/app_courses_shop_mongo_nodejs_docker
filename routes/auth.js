const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
    try {
        const { email, password } = req.body
        const candidate = await User.findOne({ email })
        // console.log(candidate)
        if (candidate) {
            const passIs = await bcrypt.compare(password, candidate.password)
            if (passIs) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                // чтобы успели данные попасть в сессию до того, как произойдет render на главную страницу, сохраняем сессию method save
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } 
        } else {
            res.redirect('/auth/login#register')
        }

    } catch (err) {
        console.log(err)
    }
})

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirm } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            res.redirect('/auth/login#login')
        } else {
            const user = new User({ email, name, password: await bcrypt.hash(password, 10), cart: { items: [] } })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (err) {
        console.log(err.message)
    }
})

module.exports = router