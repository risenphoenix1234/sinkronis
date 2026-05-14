const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    reason: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    decisionNote: { 
        type: String 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

module.exports = LeaveRequest;