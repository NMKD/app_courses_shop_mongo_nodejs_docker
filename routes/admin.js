const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("profile", {
      title: "Профиль",
      isProfile: true,
      user: req.user,
      users: users.map((v) => ({
        name: v.name,
        id: v._id,
        email: v.email,
      })),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove/:id", async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/profile");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
