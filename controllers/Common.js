const Events = require("../models/EventModel");

const getTopUsers = async (_, res) => {
  try{
    const topUsers = await User.find({})
      .sort({ coins: -1 })
      .limit(10)
      .select('name');

    if(!topUsers){
      return res.status(404).json({
        success: false,
        message: "Unable to Fetch Data",
      })
    }

    return res.status(200).json({ 
      success: true,
      message: "Fetch Data Successfully",
      data: topUsers 
    })
  }catch(error){
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Unable to find data",
    })
  }
}

const topEvents = async (_, res) => {
  try{
    const topEvents = await Events.aggregate([
      {
        $addFields: {
          visitedUsersCount: { $size: "$visited_users" }
        }
      },
      { $sort: { visitedUsersCount: -1 } }
    ]).limit(5).select("name club image desccription");

    if(!topEvents){
      return res.status(404).json({
        success: false,
        message: "Unablt to find Events"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Successfully Fetched Events",
      data: topEvents,
    })
  }catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to Fetch Events",
    });
  }
}

module.exports = {
  getTopUsers,
  topEvents
}
