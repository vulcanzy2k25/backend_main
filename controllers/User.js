const Student = require("../models/StudentModel");
const Event = require("../models/EventModel");

const getUser=async(req,res)=>{
  try {
    const userId=req.user.id
    
    const student= await Student.findById({_id:userId})
    if(!student){
     return res.status(404).json({
        status:false,
        message:'User not found'
      })
    }    
    return res.status(200).json({
      status:true,
      message:student
    })
  } catch (error) {
    return res.status(500).json({
      status:false,
      message:'Error fetching user'
    })
  }
}

const editUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authentication middleware
    const { college, reg_no, year } = req.body;

    // Validate inputs
    if (!college && !reg_no && !year) {
      return res.status(400).json({
        status: false,
        message: "At least one field is required to update.",
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      userId,
      { $set: { college, reg_no, year } },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      user: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Server error while updating profile",
    });
  }
};


const registeredEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Student.findById(userId);

    const registeredEvents = user?.registered_events;

    const events = await Event.find({ _id: { $in: registeredEvents } });

    return res.status(200).json({
      success: true,
      message: "Fetched Registered Events",
      data: events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching registered events",
    });
  }
};

const visitedEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Student.findById(userId);
    const visitedEvents = user?.visited_events;

    const events = await Event.find({ _id: { $in: visitedEvents } });

    return res.status(200).json({
      success: true,
      message: "Fetched Visited Events",
      data: events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to Fetch Visited Events",
    });
  }
};

const getRank = async (req, res) => {
  try {
    const userId = req.user.id;

    // const users = await Student.find().sort({coins: -1});
    const user = await Student.findById(userId);
    const coins = user.coins;
    // const rank = users.findIndex(user => user.user_id === userId) + 1;

    return res.status(200).json({
      success: true,
      message: "Fetched User Rank",
      data: coins,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to Fetch User Rank",
    });
  }
};

const registerNewEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId;

    const user = await Student.findById(userId);

    if (user?.registered_events.includes(eventId)) {
      return res.status(400).json({
        success: false,
        message: "User has already registered or visited this event",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await Student.findByIdAndUpdate(
      userId,
      { $push: { registered_events: eventId } },
      { new: true }
    );

    await Event.findByIdAndUpdate(
      eventId,
      { $push: { registered_users: userId } },
      { new: true }
    );

    // Send Successful Registration Mail

    return res.status(200).json({
      success: true,
      message: "Successfully registered for the event",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error registering for event",
    });
  }
};
const visitNewEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId;
    const user = await Student.findById(userId);
    const event = await Event.findOne({ eventId: eventId });
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    if (user?.visited_events.includes(event._id)) {
      return res.status(400).json({
        success: false,
        message: "User has visited this event",
      });
    }

    await Event.findByIdAndUpdate(
      event._id,
      { $push: { visited_users: userId } },
      { new: true }
    );

    await Student.findByIdAndUpdate(
      userId,
      {
        $push: { visited_events: event._id },
        $inc: { coins: 20 },
      },
      { new: true }
    );

    // await Student.findByIdAndUpdate(userId, {$push: {visited_events: eventId}}, {new: true})

    // Send Successful Registration Mail

    return res.status(200).json({
      success: true,
      message: "Successfully visited for the event",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error visiting for event",
    });
  }
};

module.exports = {
  editUser,
  registeredEvents,
  visitedEvents,
  getRank,
  registerNewEvent,
  visitNewEvent,
  getUser
};
