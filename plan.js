const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["HRIS", "Payroll", "Accounting", "All-in-One"],
    required: true,
    unique: true
  },
  baseMonthlyPrice: { 
    type: Number, 
    required: true 
    }, 
  description: { 
    type: String 
    }
});

module.exports = mongoose.models.Plan || mongoose.model("Plan", planSchema);
