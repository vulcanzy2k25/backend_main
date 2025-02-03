const express = require("express");
const router = express.Router();
const clubAuth = require("./clubAuth");
// const authRoutes = require("./Auth");
// const clubRoutes = require("./Club");
// const commonRoutes = require('./Common');
// const dashboardRoutes = require('./Dashboard');
const eventRoutes = require('./Event');
const userRoutes = require('./User');

// router.use("/auth",authRoutes);
router.use("/club",clubAuth);
// router.use("/common",commonRoutes);
// router.use("/dashboard",dashboardRoutes);
router.use("/event",eventRoutes);
router.use("/user",userRoutes);
router.use("/club",clubAuth);

module.exports = router;