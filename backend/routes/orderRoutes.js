const express = require("express");
const {
	createOrder,
	updateOrderRating,
	updateOrderStatus,
	deleteOrder,
	getOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.patch("/:id/rating", updateOrderRating);
router.patch("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
