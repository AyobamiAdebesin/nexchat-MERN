const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");

router.route('/').post(registerUser);
router.post('/login', authUser);

module.exports = router;