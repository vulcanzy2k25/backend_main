const Student = require("../models/StudentModel");
const OTP = require("../models/OtpModel");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MailSender } = require("../utilities");
const otpTemplate = require("../mailTemplates/otpTemplate");
const resetPasswordTemplate = require("../mailTemplates/resetPasswordTemplate");
const crypto = require("crypto");
require("dotenv").config();

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(401).json({
        success: false,
        message: "Student already exists",
      });
    }

    // Generate a unique OTP
    let otp;
    let isUnique = false;
    while (!isUnique) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });

      const existingOTP = await OTP.findOne({ otp });
      if (!existingOTP) {
        isUnique = true; // Ensure OTP is unique before proceeding
      }
    }

    // Create OTP in the database
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    // Send email with OTP
    try {
      await MailSender(
        email,
        "Verification OTP | TechKriya'24",
        otpTemplate(otp)
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
      return res.status(500).json({
        success: false,
        message: "Error sending verification email",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Error in sending OTP:", err);
    return res.status(500).json({
      success: false,
      message: "Error in sending OTP",
    });
  }
};

// exports.sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const studentExists = await Student.findOne({ email });

//     if (studentExists) {
//       return res.status(401).json({
//         success: false,
//         message: "Student already exists",
//       });
//     }

//     let otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     let result = await OTP.findOne({ otp: otp });

//     while (result) {
//       otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//         digits: true,
//       });
//     }

//     const otpPayload = { email, otp };
//     await OTP.create(otpPayload).then(()=>
//         {
//             try {
//                  MailSender(
//                   email,
//                   "Verification OTP | Techkriya'24",
//                   otpTemplate(otp)
//                 )
//               } catch (e) {
//                 console.log(e);
//                 return res.status(400).json({
//                   success: false,
//                   message: "Error Sending Verification Email",
//                 });
//               }

//         }
//     );
//     return res.status(200).json({
//       success: true,
//       message: "OTP Sent successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(403).json({
//       success: false,
//       message: "Error in Sending OTP",
//     });
//   }
// };

exports.signUp = async (req, res) => {
  try {
    let { name, email, password, year, college, reg_no, outsider, otp } =
      req.body;
    if (
      !name ||
      year === null ||
      !college ||
      !email ||
      !password ||
      reg_no === null ||
      otp === null
    ) {
      return res.status(401).json({
        success: false,
        message: "all details required",
      });
    }

    const userExists = await Student.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    let recentMail = await OTP.find({ email });
    if (!recentMail) {
      return res.status(401).json({
        success: false,
        message: "Email not found",
      });
    }
    let recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    recentOTP = recentOTP[0].otp;
    if (recentOTP.length !== 6) {
      return res.status(401).json({
        success: false,
        message: "Error in recent otp length",
      });
    }

    if (otp != recentOTP) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (reg_no !== null && reg_no !== undefined) {
      reg_no = reg_no.toString().trim();
    }
    await Student.create({
      name,
      email,
      password: hashedPassword,
      college,
      year,
      reg_no,
      coins: 0,
      outsider,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully Signed Up!",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(401).json({
        success: false,
        message: "Details Missing",
      });
    }

    const studentDetails = await Student.findOne({ email });
    if (!studentDetails) {
      return res.status(401).json({
        success: false,
        message: "Account Not Found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      studentDetails.password
    );
    if (passwordMatches) {
      const payload = {
        email: studentDetails.email,
        id: studentDetails._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "50h",
      });

      (studentDetails.token = token), (studentDetails.password = undefined);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user: studentDetails,
        message: "Cookie created successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password Not Matching",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "error in login",
    });
  }
};

exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 mins
      },
      { new: true }
    );

    const url = `http://localhost:3000/updatePassword/${token}`;

    await MailSender(
      email,
      "Reset Password Link | Techkriya'24",
      resetPasswordTemplate(url)
    );

    return res.status(200).json({
      success: true,
      message: "Successfully Sent Reset Password Mail",
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Unable to send reset Password Email",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword, token } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Both fields doesn't Match",
      });
    }

    const findUser = await User.findOne({ token: token });

    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "Token Invalid",
      });
    }

    if (findUser.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token Expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Unable to Reset Password",
    });
  }
};
