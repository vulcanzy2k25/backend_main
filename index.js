const express = require('express');
const app = express();

const {dbConnect} = require('./config/database');
dbConnect();

const {cloudinaryConnect} = require('./config/cloudinary');
cloudinaryConnect();

const cookieParser = require('cookie-parser');
const cors = require('cors');  
const fileUpload = require('express-fileupload');
const session = require('express-session');
const passport = require('./config/passport');

const dotenv = require('dotenv');

const routes = require('./routes');
const googleAuthRoutes = require('./routes/googleAuth');

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp"
    })
)

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);
  
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1",routes);
app.use("/api/v1/auth", googleAuthRoutes);

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