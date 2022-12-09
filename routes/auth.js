const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const transporter = require('../middleware/mail')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        errorLogin: req.flash('errorLogin'),
        errorRegister: req.flash('errorRegister')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
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
            } else {
                req.flash('errorLogin', 'Пароль неверный')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('errorLogin', 'Такого пользователя не существует')
            res.redirect('/auth/login#register')
        }

    } catch (err) {
        console.log(err)
    }
})

router.post('/register', async (req, res) => {
    try {
        let emailTransporter = await transporter();
        const { name, email, password, confirm } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            req.flash('errorRegister', 'Пользователь с таким именем или email уже существует')
            res.redirect('/auth/login#register')
        } else {
            const user = new User({ email, name, password: await bcrypt.hash(password, 10), cart: { items: [] } })
            await user.save()
            res.redirect('/auth/login#login')
            emailTransporter.sendMail({
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Регистрация прошла успешно!',
                text: `</h2>Добрый день, ${name}</h2>
                       <p>Вы успешно создали аккаунт!</p>
                `,
              }, function(err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Письмо отправлено на адрес:' + email + info.response)
                }
            })
        }
    } catch (err) {
        console.log(err.message)
    }
})

module.exports = router