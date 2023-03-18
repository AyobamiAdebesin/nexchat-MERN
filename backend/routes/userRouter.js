/**
 * @file userRouter.js
 * @description This file contains the routes for the user model.
 * Author: Ayobami Adebesin
 */

const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");

router.route("/").post(userControllers.registerUser);
router.post("/login", userControllers.authUser);

// We protect the endpoint with the middleware
router.get("/", protect, userControllers.getUsersWithKeyWord);

module.exports = router;
