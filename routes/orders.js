const { Router } = require("express");
const Order = require("../models/order");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate([
      "user.userId",
    ]);
    // await Order.deleteMany({'user.userId': req.user._id})
    res.render("orders", {
      isOrder: true,
      title: "Заказы",
      orders: orders.map((c) => {
        // console.log(c)
        return {
          ...c._doc,
          price: c.courses.reduce((total, course) => {
            return (total += course.count * course.course.price);
          }, 0),
          id: c._id.toString().slice(0, 7),
        };
      }),
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate(["cart.items.courseId"]);
    const coursers = user.cart.items.map((c) => ({
      count: c.count,
      course: {
        ...c.courseId._doc,
      },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user._id,
      },
      courses: coursers,
    });

    await order.save();
    await req.user.clearCart();
    console.log(order);
    res.redirect("orders");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
