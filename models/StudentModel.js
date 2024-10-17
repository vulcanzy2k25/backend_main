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
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  year: {
    type: Number,
    required: true,
  },
  college: {
    type: String,
    required: [true, "College is required"],
    trim: true,
  },
  reg_no: {
    type: String,
    required: [true, "Registration number is required"],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, "Only alphanumeric characters (A-Z, 0-9) are allowed"],
  },
  token:{
    type : String,
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
  ],
  visited_events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("Student", StudentSchema);