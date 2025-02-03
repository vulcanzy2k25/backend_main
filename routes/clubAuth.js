const express = require("express");
const router = express.Router();
const clubAuth = require("./../controllers/clubAuth");

router.post("/signup", clubAuth.signupClub);
router.post("/signin", clubAuth.signinClub);
router.post("/logout", clubAuth.logoutClub);

module.exports = router;
