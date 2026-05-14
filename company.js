const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const companySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    industry: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    taxId: { 
        type: String, 
        default: null 
    },
    cacNumber: { 
        type: String, 
        default: null 
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    planDuration: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
        default: null
    },
    subscriptionExpiry: {
    type: Date,
    default: null
    },
    plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
    },

    // workspaceId: { type: String, required: true },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

companySchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);