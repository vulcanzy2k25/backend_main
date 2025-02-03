const mongoose = require("mongoose");
const {
  createTokenForUser,
  createTokenForClub,
} = require("./../services/Authentication");
const { createHmac, randomBytes } = require("node:crypto");

const ClubSchema = new mongoose.Schema(
  {
    clubName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        default: [],
      },
    ],
    salt: { type: String },
  },
  { collection: "Club" }
);

ClubSchema.pre("save", function (next) {
  const club = this;
  if (!club.isModified("password")) {
    return;
    next();
  } else {
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
      .update(club.password)
      .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
  }
});

ClubSchema.static(
  "matchPasswordAndGenerateToken",
  async function (clubName, password) {
    const club = await this.findOne({ clubName });
    if (!club) throw new Error("Club not found");
    const salt = club.salt;
    const hashedPassword = club.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userProvidedHash) {
      throw new Error("Incorrect Password");
    }
    const token = createTokenForClub(club);
    return token;
  }
);

module.exports = mongoose.model("Club", ClubSchema);
