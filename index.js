const express = require('express')
const path = require('path')
const csrf = require('csurf')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require("handlebars");
const mongoose = require('mongoose')

const app = express()
const MONGODB_URI = 'mongodb://localhost:27017/shop-courses'
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

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

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrf())
app.use(require('./middleware/variables'))
app.use(require('./middleware/user'))
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
        mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB server connect')
        app.listen(PORT, () => {
            console.log('Server is running on PORT: ', PORT)
        })
    } catch (e) {
        console.log(e.message)
    }
}

start()