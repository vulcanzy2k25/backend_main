const JWT = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET || "SecretKeyForClub";

function createTokenForClub(club) {
  const payload = {
    _id: club._id,
    clubName: club.clubName,
  };
  const token = JWT.sign(payload, secret, { expiresIn: "3d" });
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForClub,
  validateToken,
};
