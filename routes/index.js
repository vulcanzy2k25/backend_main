const express = require("express");
const router = express.Router();
const clubAuth = require("./clubAuth");
const eventRoutes = require('./Event');
const userRoutes = require('./User');

router.use("/club",clubAuth);
router.use("/event",eventRoutes);
router.use("/user",userRoutes);
router.use("/club",clubAuth);

module.exports = router;