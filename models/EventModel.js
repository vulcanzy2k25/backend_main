const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
  },
  eventId:{
    type: String,
    required: [true, "Event ID is required"],
    unique: true,
  },
  clubName: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  coins: {
    type: Number,
    default: 20,
  },
  registered_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: [],
    },
  ],
  visited_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Event", EventSchema);
