const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
  },
  googleId: {
    type: String,
    unique: true,
    required: [true, "Google ID is required"],
  },
  avatar: {
    type: String, // URL of the avatar (Google profile picture)
  },
  year: {
    type: Number,
  },
  college: {
    type: String,
    // required: [true, "College is required"],
  },
  reg_no: {
    type: String,
    unique: true,
    match: [/^[A-Za-z0-9]+$/, "Only alphanumeric characters (A-Z, 0-9) are allowed"],
  },
  coins: {
    type: Number,
    default: 0,
  },
  outsider: {
    type: Boolean,
  },
  registered_events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ]
  
});

module.exports = mongoose.model("Student", StudentSchema);
