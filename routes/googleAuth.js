const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
  }
);

router.get("/success", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Google Authentication Successful",
    user: req.user,
  });
});

router.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google Authentication Failed",
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    req.session.destroy((error) => {
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.clearCookie("connect.sid");
      res.status(200).json({ success: true, message: "Logged out successfully" });
    });
  });
});


module.exports = router;
