const { Router } = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const { validationResult } = require("express-validator");
const { courseValidators } = require("../utils/validation");
const router = Router();

router.get("/", auth, (req, res) => {
  try {
    res.render("add", {
      title: "Добавить курс",
      isAdd: true,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", auth, courseValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array()[0].msg);
      return res.status(400).render("add", {
        title: "Добавить курс",
        isAdd: true,
        errors: req.flash("error"),
        data: {
          title: req.body.title,
          price: req.body.price,
          img: req.body.img,
        },
      });
    }
    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      userId: req.user._id,
    });
    console.log(course);
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
