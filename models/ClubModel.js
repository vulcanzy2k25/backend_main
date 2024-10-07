const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  club_name: {
    type: String,
    required: [true, "Club name is required"],
    trim: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Club", ClubSchema);