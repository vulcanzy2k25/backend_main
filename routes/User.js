const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {userController} = require("../controllers");

router.put("/editUser", authMiddlewares.auth, userController.editUser);
router.get("/registeredEvents", authMiddlewares.auth, userController.registeredEvents);
router.get("/visitedEvents", authMiddlewares.auth, userController.visitedEvents);
router.get("/fetchRank", authMiddlewares.auth, userController.getRank);
router.post("/register/:eventId", authMiddlewares.auth, userController.registerNewEvent);
router.post("/visited/:eventId", authMiddlewares.auth, userController.visitNewEvent);

module.exports = router;