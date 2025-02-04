const Event = require("./../models/EventModel");
const Club = require("./../models/ClubModel");
const { UploadMedia } = require("../utilities");

const createEvent = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const { image } = req.files;
    const clubId = req.user._id;

    if (!name || !description || !date || !location || !image || !clubId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    const imageResponse = await UploadMedia(image, "Vulcanzy'25");
    if (!imageResponse) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed.",
      });
    }

    const newEvent = await Event.create({
      name,
      club: club._id,
      clubName: club.clubName,
      description,
      image: imageResponse.secure_url,
      date,
      location,
    });

    // ✅ Use findByIdAndUpdate to push the event into the club's events array
    await Club.findByIdAndUpdate(
      clubId,
      { $push: { events: newEvent._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Event successfully created.",
      event: newEvent,
    });
  } catch (err) {
    console.error("Error creating event:", err);
    return res
      .status(500)
      .json({ success: false, message: "Unable to create event." });
  }
};


// const createEvent = async (req, res) => {
//   try {
//     const { name, description, date, location } = req.body;
//     const { image } = req.files;
//     const clubId = req.club._id;

//     if (!name || !description || !date || !location || !image || !clubId) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields.",
//       });
//     }

//     const club = await Club.findById(clubId);
//     if (!club) {
//       return res.status(404).json({
//         success: false,
//         message: "Club not found.",
//       });
//     }

//     const imageResponse = await UploadMedia(image, "Vulcanzy'25");
//     if (!imageResponse) {
//       return res.status(400).json({
//         success: false,
//         message: "Image upload failed.",
//       });
//     }

//     const newEvent = await Event.create({
//       name,
//       club: club._id,
//       clubName: club.clubName,
//       description,
//       image: imageResponse.secure_url,
//       date,
//       location,
//     });

//     club.events.push(newEvent._id);
    
//     await club.save();
//     return res.status(200).json({
//       success: true,
//       message: "Event successfully created.",
//     });
//   } catch (err) {
//     console.error("Error creating event:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Unable to create event." });
//   }
// };

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description, date, location } = req.body;
    const loggedInClubId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }

    if (loggedInClubId !== event.club.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    if (req.files && req.files.image) {
      const imageResponse = await UploadMedia(req.files.image, "Vulcanzy '25");
      if (imageResponse) event.image = imageResponse.secure_url;
    }
    if (name) event.name = name;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;

    await event.save();
    return res
      .status(200)
      .json({ success: true, message: "Event updated.", data: event });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ success: false, message: "Update failed." });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const loggedInClubId = req.user._id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.club.toString() !== loggedInClubId) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    // Remove event ID from club's events array
    await Club.findByIdAndUpdate(loggedInClubId, {
      $pull: { events: eventId },
    });

    await Event.findByIdAndDelete(eventId);
    
    return res.status(200).json({ success: true, message: "Event deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Deletion failed." });
  }
};


const getAllEvents = async (_, res) => {
  try {
    const events = await Event.find({});
    return res
      .status(200)
      .json({ success: true, message: "Events fetched.", data: events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Fetch failed." });
  }
};

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Event fetched.", data: event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Fetch failed." });
  }
};

const getTodayEvents = async (req, res) => {
  try {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    const events = await Event.find({ date: formattedDate });
    if (!events.length) {
      return res
        .status(404)
        .json({ success: false, message: "No events today." });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Today's events fetched.",
        data: events,
      });
  } catch (error) {
    console.error("Error fetching today's events:", error);
    return res.status(500).json({ success: false, message: "Fetch failed." });
  }
};


const getClubEvents=async(req,res)=>{
  try{
    
  const loggedInClubId = req.user._id;

  const events=await Event.find({club:loggedInClubId})
  return res.status(200).json({ success: true,data:events  });
} catch (err) {
  console.error(err);
  return res
    .status(500)
    .json({ success: false });
}}

const registeredUsers=async(req,res)=>{
  try {
    const { eventId } = req.params;

    // Find the event and populate registered users
    const event = await Event.findById(eventId).populate("registered_users", "name email college year reg_no");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    return res.status(200).json({ success: true, users: event.registered_users });
  } catch (err) {
    console.error("Error fetching registered users:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getTodayEvents,
  getClubEvents,
  registeredUsers
};
