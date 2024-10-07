const express = require('express');
const app = express();

const {dbConnect} = require('./config/database');
dbConnect();

const {cloudinaryConnect} = require('./config/cloudinary');
cloudinaryConnect();

const cookieParser = require('cookie-parser');
const cors = require('cors');  
const fileUpload = require('express-fileupload');

// Remove Before Deployment (Dependency)
const dotenv = require('dotenv');

const routes = require('./routes');

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"*",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp"
    })
)

app.use("/api/v1",routes);

app.get("/",(_,res) => {
    return res.status(200).json({
        success:true,
        message:"Server is Running..."
    });
});

app.listen(PORT,() => {
    console.log(`App is Running at PORT ${PORT}`);
})
module.exports = app;