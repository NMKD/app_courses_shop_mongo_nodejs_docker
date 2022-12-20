const { Router } = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, (req, res) => {
  res.render("../views/profile", {
    title: "Профиль",
    isProfile: true,
    user: req.user,
  });
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const toChange = {
      name: req.body.name
    }
    console.log(req.file)
    if (req.file) {
      toChange.avatarURL = req.file.path
    }

    Object.assign(user, toChange)
    await user.save()
    res.redirect('/profile')
  } catch (e) {}
});
module.exports = router;
