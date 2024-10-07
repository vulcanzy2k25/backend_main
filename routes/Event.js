const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {eventController} = require('../controllers');

// WRITE ROUTES HERE
router.post('/createEvent',eventController.createEvent);
router.delete('/deleteEvent/:eventId',eventController.deleteEvent);
router.get('/getAllEvents',eventController.getAllEvents);
router.get('/getEvent/:eventId',eventController.getEventById);

module.exports = router;