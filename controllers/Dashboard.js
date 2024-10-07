const Student = require("../models/StudentModel");
const Events = require("../models/EventModel");
const Club = require("../models/ClubModel");

exports.fetchAllEventsWithRegisteredAndVisitedUsers = async(_,res) => {
    try{
        const events = await Events.find({})
                    .populate({
                        path : "club",
                        select : "club_name",
                    })
                    .populate({
                        path : "registered_users",
                        select : "_id",
                    })
                    .populate({
                        path : "visited_users",
                        select : "_id",
                    });

        const eventCounts = events.map(event => ({
            club_name : event?.club?.club_name,
            registered_count : event?.registered_users.length,
            visited_count : event?.visited_users.length,
        }));

        return res.status(200).json({
            success : true,
            data : eventCounts,
            message : "Events Data Fetched Successfully"
        })
    }
    catch(e){
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to fetch events data"
        })
    }
}

exports.fetchEventById = async(req,res) => {
    try{

        const eventId = req.params.eventId;

        if(!eventId){
            return res.status(404).json({
                success : false,
                message : "EventId was not found."
            })
        }

        const event = await Events.findById(eventId)
                        .populate({
                            path : "registered_users",
                            select : "name reg_no",
                        })
                        .populate({
                            path : "visited_users",
                            select : "name reg_no",
                        });

        if(!event){
            return res.status(404).json({
                success : false,
                message : "Event Not Found."
            });
        };

        return res.status(200).json({
            success : true,
            data : event,
            message : "Successfully fetched the event"
        })
    }
    catch(e){
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to fetch the event"
        })
    }
}

exports.fetchAllEventsConductedByClubs = async(_,res) => {
    try{

        const clubs = await Club.find({})
                                .populate({
                                    path : "events",
                                    select : "event_name registered_users visited_users"
                                });

        const clubEvents =  clubs.map(club => {
            const eventDetails = club.events.map(event => ({
                event_name : event?.event_name,
                registered_count : event?.registered_users.length,
                visited_count : event?.visited_users.length,
            }))

            return {
                club_name : club?.club_name,
                events : eventDetails,
            }
        })

        return res.status(200).json({
            success : true,
            data : clubEvents,
            message : "Successfully fetched the all clubs and events",
        });
    }
    catch(e){
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to fetch the club events",
        })
    }
}

exports.fetchUserStastistics = async(_,res) => {
    try{
        const totalUserAccounts = await Student.find({});

        const totalUserAccountsCount = totalUserAccounts.length > 0 ? totalUserAccounts.length : 0;

        const totalOutSidersAccounts = await Student.find({ outsider: true });

        const totalOutSidersAccountsCount = totalOutSidersAccounts.length > 0 ? totalOutSidersAccounts.length : 0 ;

        const totalVisitedAccounts = await Events.aggregate([
            {
                $project : {
                    visited_count : {$size : "$visited_users"}
                }
            },
            {
                $group : {
                    _id : null,
                    count : {$sum : "$visited_count"}
                }
            }
        ]);

        const totalVisitedAccountsCount = totalVisitedAccounts.length > 0 ? totalVisitedAccounts[0].count : 0 ;

        const totalRegisteredAccounts = await Events.aggregate([
            {
                $project : {
                    registered_count : {$size : "$registered_users"}
                }
            },
            {
                $group : {
                    _id : null,
                    count : {$sum : "$registered_count"}
                }
            }
        ]);

        const totalRegisteredAccountsCount = totalVisitedAccounts.length > 0 ? totalRegisteredAccounts[0].count : 0 ;

        return res.status(200).json({
            success : true,
            data : {
                total_User_Accouts_Count : totalUserAccountsCount,
                total_Outsiders_Account_Count : totalOutSidersAccountsCount,
                total_Visited_Account_Count : totalVisitedAccountsCount,
                total_Registered_Account_Count : totalRegisteredAccountsCount,
            },
            message : "Successfully Fetched User Statistics"
        })
    }
    catch(e){
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to fetch User statistics"
        })
    }
}