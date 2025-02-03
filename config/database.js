const mongoose = require('mongoose');
require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("DB Connected Successfully"))
        .catch((e) => {
            console.log("DB Connection Unsuccessful");
            console.error(e);
            process.exit(1);
        });
};