const express = require("express");
const path = require("path");
const helmet = require("helmet");
const flesh = require("connect-flash");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

// Import dotenv
dotenv.config();

const store = new MongoStore({
  collection: "sessions",
  uri: process.env.MONGODB_URI,
});

// express-handlebars
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
// регистрируем, что в express есть движок express-handlebars, его значение hbs.engine
app.engine("hbs", hbs.engine);
// используем движок
app.set("view engine", "hbs");
// где будут шаблоны
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "https://*.cloudflare.com",
        "https://*.googleapis.com",
      ],
      "style-src": [
        "'self'",
        "https://*.cloudflare.com",
        "https://*.googleapis.com",
        "https://*.unsplash.com",
        "'unsafe-inline'",
      ],
      "img-src": ["'self'", "*"],
      "font-src": ["'self'", "*"],
      "object-src": ["'none'"],
    },
  })
);

app.disable("x-powered-by");
app.use(flesh());
app.use(require("./middleware/variables"));
app.use(require("./middleware/user"));
app.use(require("./middleware/file").single("avatar"));
app.use("/", require("./routes/home"));
app.use("/add", require("./routes/add"));
app.use("/courses", require("./routes/courses"));
app.use("/card", require("./routes/card"));
app.use("/orders", require("./routes/orders"));
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use(require("./middleware/404"));

const PORT = process.env.PORT || 3000;
// mongo db DOCKER
async function start() {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log('MongoDB server connect')
    // console.log(typeof process.env.MY_NAME_IS)
    app.listen(PORT, () => {
      console.log("Server is running on PORT:", PORT);
    });
  } catch (e) {
    console.log(e.message);
  }
}

start();
