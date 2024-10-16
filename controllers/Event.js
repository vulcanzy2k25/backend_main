const Event = require('../models/EventModel');
const Club = require('../models/ClubModel');
const {UploadMedia} = require('../utilities');

const createEvent = async (req, res) => {
  try{
    const {name,clubId,description,eventId} = req.body;
    const {image} = req.files;

    if(!name || !clubId || !description || !image || !eventId){
        return res.status(404).json({
            success: false,
            message: "Data is Missing",
        })
    }

    const club = await Club.findById(clubId);
    if(!club){
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const imageResponse = await UploadMedia(image,"TechKriya'24");
    if(!imageResponse){
      return res.status(402).json({
        success: false,
        message: "Unable to Uplaod image",
      })
    }
    const clubName=await Club.findById(clubId);
    if(!clubName){
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const newEvent = await Event.create({
      name,
      club: club._id,
      clubName:clubName.club_name,
      description,
      eventId,
      image: imageResponse?.secure_url,
    });

    club.events.push(newEvent._id);
    await club.save();

    return res.status(201).json({
      success: true,
      message: "Event successfully created",
    });
  }catch(error){
    console.log(error);
    return res.status(400).json({
        success: false, 
        message: "Unable to Create Event",
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    if(!eventId){
      return res.status(404).json({
        success: false,
        message: "Event ID is missing",
      })
    }

    const deletedEvent = await Event.findOneAndDelete({ _id:eventId });
    if(!deletedEvent){
      return res.status(404).json({ 
        success: false,
        message: "Event not found" 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: "Event successfully deleted", 
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Unable to Delete Event",
    });
  }
};

const getAllEvents = async (_, res) => {
  try{
    const events = await Event.find({});
    if(!events){
      return res.status(404).json({
        success: false,
        message: "Unable to Fetch Events",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Fetched All Events",
      data: events,
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Unable to Fetch events",
    });
  }
};

const getEventById = async (req, res) => {
  try{
    const { eventId } = req.params;
    if(!eventId){
      return res.status(404).json({
        success: false,
        message: "Event Id not found",
      })
    }

    const event = await Event.findOne({ _id:eventId });

    if(!event){
      return res.status(404).json({ 
        success: false,
        message: "Event not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched Event Successfully",
      data: event,
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Unable to Fetch Event",
    });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
};
