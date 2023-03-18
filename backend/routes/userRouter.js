/**
 * @file userRouter.js
 * @description This file contains the routes for the user model.
 * Author: Ayobami Adebesin
 */

const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");

router.route("/").post(userControllers.registerUser);
router.post("/login", userControllers.authUser);

module.exports = router;
