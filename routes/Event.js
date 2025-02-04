const express = require("express");
const router = express.Router();
const eventController = require("../controllers/Event.js")
const {authMiddlewares} =require("../middlewares")
router.post("/createEvent",authMiddlewares.auth ,eventController.createEvent)
router.post("/updateEvent/:eventId",authMiddlewares.auth ,eventController.updateEvent)
router.post("/deleteEvent/:eventId",authMiddlewares.auth ,eventController.deleteEvent)
router.get("/getAllEvents", eventController.getAllEvents)
router.get("/getTodayEvents", eventController.getTodayEvents)
router.get('/getEvent/:eventId', eventController.getEventById);
router.get('/getClubEvents',authMiddlewares.auth,eventController.getClubEvents)
router.get('/regUsers/:eventId',authMiddlewares.auth,eventController.registeredUsers)

module.exports = router;