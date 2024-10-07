const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {dashboardController} = require('../controllers');

// WRITE ROUTES HERE
router.get("fetchAllEventsWithRegisteredAndVisitedUsers",dashboardController.fetchAllEventsWithRegisteredAndVisitedUsers);
router.get("fetchEventById:eventId",dashboardController.fetchEventById);
router.get("fetchAllEventsConductedByClubs",dashboardController.fetchAllEventsConductedByClubs);
router.get("fetchUserStastistics",dashboardController.fetchUserStastistics);

module.exports = router;