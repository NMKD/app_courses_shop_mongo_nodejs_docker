const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require("handlebars");
const mongoose = require('mongoose')
const User = require('./models/user')
const app = express()

// express-handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

// регистрируем, что в express есть движок express-handlebars, его значение hbs.engine
app.engine('hbs', hbs.engine)
// используем движок
app.set('view engine', 'hbs')
// где будут шаблоны
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        req.user = await User.findById('637bd0d10e406befd3a41a7e')
        // console.log(req.user)
        next()
    } catch (e) {
        console.log(e.message)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use('/', require('./routes/home'))
app.use('/add', require('./routes/add'))
app.use('/courses', require('./routes/courses'))
app.use('/card', require('./routes/card'))
app.use('/orders', require('./routes/orders'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

// mongo db DOCKER
async function start() {
    try {
        mongoose.connect('mongodb://localhost:27017/shop-courses', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'kristina.kryazheva@bk.ru',
                name: 'Kristina', 
                cart: {items: []}
            })

            await user.save()
        }
        // console.log(candidate)
        app.listen(PORT, () => {
            console.log('Server is running on PORT: ', PORT)
        })

        console.log('MongoDB server connect')
    } catch (e) {
        console.log(e.message)
    }
}

start()