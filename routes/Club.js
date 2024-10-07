const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {clubController} = require('../controllers');

// WRITE ROUTES HERE
router.post("/createClub", clubController.createClub);
router.put("/editClub/:clubId", clubController.editClub);
router.delete("/deleteClub/:clubId", clubController.deleteClub);
router.get("/getAllClubs", clubController.getAllClubs);
router.get("/getClub/:clubId", clubController.getClubById);
router.get("/getClubEvents/:clubId", clubController.getClubEvents);

module.exports = router;