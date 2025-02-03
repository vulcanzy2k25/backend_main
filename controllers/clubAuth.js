const Club = require("./../models/ClubModel");

exports.signupClub = async (req, res) => {
  const { clubName, password } = req.body;
  
  if (clubName && password) {
    try {
      const existingUser = await Club.findOne({ clubName });
      
      if (existingUser) {
        return res.status(400).send("Clubname already taken");
      }

      const newUser = new Club({
        clubName: clubName,
        password: password,
      });

      await newUser.save();

      return res.status(200).send(
        {
          message:`Club ${clubName} registered successfully!`,
          success:true,
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  } else {
    return res.status(500).send("Missing Credentials");
  }
};

exports.signinClub = async (req, res) => {
  const { clubName, password } = req.body;
  if (clubName && password) {
    try {
      const club = await Club.findOne({ clubName });
      if (club) {
        const token = await Club.matchPasswordAndGenerateToken(
          clubName,
          password
        );
        return res
          .cookie("token", token, {
            httpOnly: false,
            //   secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          })
          .json({ message: "Cookie provided", token });
      } else {
        return res.status(500).send("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Invalid credentials" });
    }
  } else {
    return res.status(500).json({ message: "All credentials are required" });
  }
};

exports.logoutClub = async (req, res) => {
  res.clearCookie("token");
  return res.status(201).send("Logout successful");
};
