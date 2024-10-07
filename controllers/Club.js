const Club = require("../models/ClubModel");

exports.createClub = async (req, res) => {
  try{
    const {club_name} = req.body;
    if(!club_name){
        return res.status(404).json({
            success: false,
            message: "Club Name Not Found",
        })
    }

    await Club.create({club_name});

    return res.status(200).json({
        success: true,
        message: "Created Club Successfully",
    })
  }catch(error){
    console.log(error);
    return res.status(400).json({
        success: false,
        message: "Unable Create Club",
    })
  }
};

exports.editClub = async (req, res) => {
  try{

    const {club_name} = req.body;
    const {clubId} = req.params;

    if(!clubId || !club_name){
        return res.status(402).json({
            success: false,
            message: "Data Not Found",
        })
    }

    const club = await Club.findByIdAndUpdate({_id : clubId}, {club_name : club_name}, { new: true});

    if(!club){
        return res.status(404).json({ 
            success: false,
            message: "Club Not Found", 
        });
    }

    return res.status(200).json({
        success: true,
        message: "Edited Club Details",
    });
  }catch(error){
    console.log(error);
    return res.status(400).json({ 
        success: false,
        message: "Unable to update Club Data"
    });
  }
};

exports.deleteClub = async (req, res) => {
  try{
    const {clubId} = req.params;

    if(!clubId){
        return res.status(404).json({
            success: false,
            message: "Club ID not found",
        })
    }

    const club = await Club.findByIdAndDelete(clubId);
    if(!club){
        return res.status(404).json({ 
            success: false,
            message: "Club not found" 
        });
    }

    return res.status(200).json({ 
        success: true,
        message: "Club deleted successfully" 
    });

  }catch(error){
    console.log(error);
    return res.status(500).json({ 
        success: false,
        message: "Unable to Delete Club"
    });
  }
};

exports.getAllClubs = async (_, res) => {
  try{
    const clubs = await Club.find({});
    return res.status(200).json({
        success: true,
        message: "Fetched Clubs Successfully",
        data: clubs,
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Unable to fetch Clubs",
    });
  }
};

exports.getClubById = async (req, res) => {
  try{
    const {clubId} = req.params;
    if(!clubId){
        return res.status(404).json({
            success: false,
            message: "Club Id Not Found",
        })
    }

    const clubDetails = await Club.findById(clubId);
    if(!clubDetails){
        return res.status(404).json({ 
            message: "Club not found" 
        });
    }
    return res.status(200).json({
        success: true,
        message: "Fetch Club Successfully",
        data: clubDetails,
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Unable to fetch Club Data",
    });
  }
};

exports.getClubEvents = async (req, res) => {
  try{
    const {clubId} = req.params;
    if(!clubId){
        return res.status(404).json({
            success: false,
            message: "Club Id not found",
        })
    }

    const clubEvents = await Club.findById(clubId).populate("events");
    if(!clubEvents){
        return res.status(404).json({ 
            success: false,
            message: "Club not found" 
        });
    }
    return res.status(200).json({
        success: true,
        message: "Fetch Club Events",
        data: clubEvents
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Unable to Fetch Club Events",
    });
  }
};
