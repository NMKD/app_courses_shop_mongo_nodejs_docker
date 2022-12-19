const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный Email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject(
            "Пользователь с таким email уже зарегистрирован"
          );
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body(
    "password",
    "Пароль должен быть минимум 8 символов и содержать латинские заглавные и строчные буквы"
  )
    .isLength({ min: 8, max: 32 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли не совпадают");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Имя должно быть минимум 3 символа")
    .trim(),
];
