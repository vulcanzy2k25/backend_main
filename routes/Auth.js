const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {authController} = require('../controllers');

router.post("/login",authController.login);
router.post("/signup", authController.signUp)                    
router.post("/sendOtp", authController.sendOTP)                 

router.post("/resetPasswordToken", authController.resetPasswordToken)          
router.post("/resetPassword", authController.resetPassword)             

module.exports = router;