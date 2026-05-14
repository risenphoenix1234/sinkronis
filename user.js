const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User"
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    profilePicture: {
      type: String, 
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
    },
    nextOfKin: {
      name: { type: String },
      contactAddress: { type: String },
    },
    bankInformation: {
      accountNumber: { type: String },
      bankName: { type: String },
    },
    password: {
      type: String,
      required: function () {
        return this.status === "active";
      },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "exited", "pending"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Use a regular function to correctly bind `this`
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
