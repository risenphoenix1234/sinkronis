const { required } = require("joi");
const mongoose = require("mongoose");

const leavePolicySchema = new mongoose.Schema({
    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        unique: true
    },
    leaveTypes: [
        {
            type:{ 
                type: String, 
                required: true 
            }, 
            maxTimesPerYear: {
                type: Number, 
                required: true 
                },
            maxDaysPerLeave: {
                type: Number, 
                required: true 
                },
        }
    ]
},
{ timestamps: true} );

const LeavePolicy = mongoose.model("LeavePolicy", leavePolicySchema);

module.exports = LeavePolicy;