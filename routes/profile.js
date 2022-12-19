const { Router } = require("express");
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
  res.status(200);
});
module.exports = router;
