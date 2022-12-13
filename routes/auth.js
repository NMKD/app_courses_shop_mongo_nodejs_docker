const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const transporter = require('../middleware/mail')
const router = Router()

router.get('/login', (req, res) => {
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
                text: `Добрый день, ${name}
                    Вы успешно создали аккаунт!
                `,
            }, function (err, info) {
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

router.get('/reset', (req, res) => {
    res.render('../views/auth/reset', {
        title: "Восстановление пароля",
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(16, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так, повторите попытку позже')
                return res.redirect('/auth/reset')
            }
            let token = buffer.toString('hex')
            const user = await User.findOne({ email: req.body.email })

            if (user) {
                user.resetToken = token
                user.resetTokenExp = Date.now() + 60 * 60 * 1000
                await user.save()
                console.log(user)
                res.redirect('/auth/login')
                let emailTransporter = await transporter();
                emailTransporter.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to: user.email,
                    subject: 'Восстановление пароля',
                    html: `<h2>${user.name},</h2>
                    <div style="padding: 15px 0;"> 
			        Если вы не делали запроса для получения пароля, то просто удалите данное письмо. 
                    Ваш пароль храниться в надежном месте и 
                    недоступен посторонним лицам.
		            </div>
                    <a href="${process.env.DOMEN_URL}/auth/password/${token}" style="width: 400px;
                    margin:0 auto;
                    display: block;
                    background: #4CAF50;
                    color: #fff;
                    font-weight:bold; 
                    line-height: 44px;
                    text-align: center;
                    text-transform: uppercase;
                    text-decoration: none;
                    border-radius: 3px;text-shadow: 0 1px 3px rgba(0,0,0,.35);
                    border: 1px solid #388E3C;box-shadow: inset 0 1px rgba(255,255,255,.4);">
                    Восстановить пароль
                    </a>
                    <p><a href="${process.env.DOMEN_URL}">Магазин курсов</a><p>`
                }, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Письмо отправлено на адрес:' + user.email + info.response)
                    }
                })
            } else {
                req.flash('error', 'Такого пользователя с email - не зарегистрирован!')
                return res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() }
        })
        if (!user) {
            return res.redirect('/auth/login#login')
        } else {
            res.render('auth/pass', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                id: user._id,
                token: req.params.token
            })
        }

    } catch (e) {
        console.log(e)
    }
})

router.post('/password/:token/:id', async (req, res) => {
    try {

        const user = await User.findOne({
            resetToken: req.params.token,
            _id: req.params.id,
            resetTokenExp: { $gt: Date.now() }
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash("errorLogin", "Ссылка восстановление доступа истекла")
            return res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = router