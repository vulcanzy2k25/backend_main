const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {commonController} = require('../controllers');

// WRITE ROUTES HERE
router.get("/getTopUsers",commonController.getTopUsers);
router.get("/topEvents",commonController.topEvents);

module.exports = router;