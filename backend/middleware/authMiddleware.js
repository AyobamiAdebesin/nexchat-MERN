/**
 * @description: Protect endpoints from users that are not authorized with the jwt
 * @file authMiddleware.js
 * Author: Ayobami Adebesin
 * @requires jsonwebtoken
 * @requires UserModel
 * @exports protect
 */
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
/**
 * @description: This function protects endpoints from users that are not authorized with the jwt
 * @description: This is analogous to @jwtrequired() decorator in Flask
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Decodes the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send("Not authorized, token failed");
      throw new Error("Not authorized, token failed");
    }
  }
};

module.exports = protect;
