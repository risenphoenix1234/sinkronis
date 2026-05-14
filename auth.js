const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Company = require("../models/company");
const User = require("../models/user");
const sendEmail = require("../utils/email");
const signJwt = require("../utils/signJwt");
const AppError = require("../utils/AppError");

// Company Sign Up
const companySignUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      industry: Joi.string().required(),
      address: Joi.string().required(),
      cacNumber: Joi.string().required(),
      taxId: Joi.string().required(),
      password: Joi.string().min(6).required(),
      planType: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const existingCompany = await Company.findOne({ email: req.body.email });
    if (existingCompany) throw new AppError("Company already exists", 409);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const company = await Company.create([{
      ...req.body,
      password: hashedPassword,
    }], { session });

    const token = signJwt({ id: company[0]._id });

    await sendEmail({
      email: company[0].email,
      subject: "Welcome to Sinkronis",
      template: "welcomeEmail", 
      data: {
        companyName: company[0].name,
      },
    });


    await session.commitTransaction();
    res.status(201).json({
      status: "success",
      token,
      company: {
        id: company[0]._id,
        email: company[0].email,
        companyName: company[0].name,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);
    const { email, password } = req.body;

    let entity = await Company.findOne({ email }).select('+password');
    if (!entity || !entity.password) {
      throw new AppError("Invalid email or password", 401);
    }
    console.log(entity.password);
    

    // const isMatch = await bcrypt.compare(password, entity.password);
    // if (!isMatch){
    //    throw new AppError("Invalid email or password", 401);
    // }

    const token = signJwt({ id: entity._id });
    res.status(200).json({ status: "success",
      message:"Login Succesful",
      user:entity,
      token 
      }); 
  } catch (err) {
    next(err);
  }
};

// HR Invitation
const hrInvitation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) throw new AppError("User already exists", 409);

    const companyId = req.companyId;

    const user = await User.create([{
      ...req.body,
      role: "Admin",
      companyId,
      isActive: false,
    }], { session });

    const token = crypto.randomBytes(32).toString("hex");
    user[0].inviteToken = token;
    await user[0].save({ session });

    await sendEmail({
      email: req.body.email,
      subject: "HR Account Invitation",
      template: "hrInviteEmail", 
      data: {
        firstName: req.body.firstName,
        activationLink: `https://sinkronis.vercel.app/activate?token=${token}`,
      },
    });


    await session.commitTransaction();
    res.status(201).json({ status: "success", message: "HR invited successfully" });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// Activate Employee Account
const activateEmployeeAccount = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ inviteToken: token });
    if (!user || user.isActive) throw new AppError("Invalid or expired token", 400);

    user.password = await bcrypt.hash(password, 12);
    user.isActive = true;
    user.inviteToken = undefined;
    await user.save({ session });
 
    await sendEmail({
      email: user.email,
      subject: "Account Activated",
      template: "activationSuccessEmail",
      data: {
        firstName: user.firstName,
      },
    });

    await session.commitTransaction();
    res.status(200).json({ status: "success", message: "Account activated successfully" });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const entity = await Company.findOne({ email }) || await User.findOne({ email });
    if (!entity) throw new AppError("No user with that email", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    entity.otp = otp;
    entity.otpExpires = Date.now() + 10 * 60 * 1000;
    await entity.save();

    await sendEmail({
      email,
      subject: "Reset Your Password - OTP",
      template: "otpEmail",
      data: {
        otp,
      },
    });


    res.status(200).json({ status: "success", message: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

// Verify OTP
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const entity = await Company.findOne({ email }) || await User.findOne({ email });
    if (!entity || !entity.otp || entity.otp !== otp || entity.otpExpires < Date.now()) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    res.status(200).json({ status: "success", message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
};

// Reset Password With OTP
const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const entity = await Company.findOne({ email }) || await User.findOne({ email });
    if (!entity || !entity.otp || entity.otp !== otp || entity.otpExpires < Date.now()) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    entity.password = await bcrypt.hash(password, 12);
    entity.otp = undefined;
    entity.otpExpires = undefined;
    await entity.save();

    res.status(200).json({ status: "success", message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  companySignUp,
  login,
  hrInvitation,
  activateEmployeeAccount,
  forgotPassword,
  verifyOtp,
  resetPasswordWithOtp

}