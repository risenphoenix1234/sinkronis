const LeaveRequest = require("../models/leaveRequest");
const AppError = require("../utils/AppError");
const Employee = require("../models/employee");
const moment = require("moment");
const LeavePolicy = require("../models/leavePolicy");
const User = require("../models/user");






const createLeavePolicy = async (req, res, next) =>{

    try {
        const companyId = req.company._id;
        const { leaveTypes } = req.body;

        const existing = await LeavePolicy.findOne({ company: companyId });
        if (existing) {
            throw new AppError("Leave Policy Already Exists for this company", 400);
        }

        const policy = await LeavePolicy.create({
            company: companyId,
            leaveTypes
        })
        
        if (!policy) {
            throw new AppError("Unable to Create Leave Policy");
        }

        res.status(201).json({
            status: "success",
            message: "Leave Policy Successfully Created",
            data: policy,
        })
    } catch (error) {
        next(error);
    }
}


const requestLeave = async (req, res, next) => {
    try {

        const userId = req.user._id;
        const employee =  await Employee.findOne({ user:userId }).populate("company");

        if(!employee) {
            throw new AppError("No employee with this ID was found", 404);
        }
        const { type, startDate, endDate, reason } = req.body;

        const leavePolicy = await LeavePolicy.findOne({ company: employee.company._id })

        if (!leavePolicy) {
            throw new AppError("Leave Policy Not Defined For This Company",404)            
        }
        const policy = leavePolicy.leaveTypes.find((lt) =>  lt.type === type);
        
        if (!policy) {
            throw new AppError(`Leave Type ${type} is not allowed`,403);
        }

        const start = moment(startDate);
        const end = moment(endDate);
        const leaveDays = end.diff(start, "days") + 1;

        if (leaveDays > policy.maxDaysPerLeave) {
            throw new AppError(`Requested leave exceeds max allowed days for ${type} leave (${policy.maxDaysPerLeave} days)`)
        }

        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);

        const leaveHistory = await LeaveRequest.find({
            employee: employee._id,
            type,
            startDate: { $gte: yearStart, $lte: yearEnd }
        })

        if (leaveHistory.length >= policy.maxTimesPerYear) {
            throw new AppError(`You have used up  all allowed ${type} leave(s) for this year`)
        }

        const leave = await LeaveRequest.create({
            employee: employee._id,
            type,
            startDate,
            endDate,
            reason
        });

        res.status(201).json({
            status: "success",
            message: "leave request created succesfully",
            leaveDetails: leave
        })

    } catch (error) {
        next(error)
    }
}

const getEmployeeLeaveHistory = async(req, res, next) => {
    try {
        const userId = req.user._id

        const employee = await Employee.findOne({ user: userId });
        
        if (!employee) {
            throw new AppError("employee with this Id not found", 403)
        }

        const leaveHistory =  await LeaveRequest.find({ employee: employeeId }).sort({ createdAt: -1 });

        res.status(200).json({
            status:"success",
            message: "Employee leave history successfully fetched",
            count: leaveHistory.length,
            data: leaveHistory
        })
        
    } catch (error) {
        next(error);
    }
}   

const getLeaveHistoryByEmployeeId = async(req, res, next) => {
    try {
        const { employeeId } = req.params;

        const leaveHistory = await LeaveRequest.find({ employee: employeeId }).sort({ createdAt: -1});

        res.status(200).json({
            status:"success",
            message:"employee leave history successfully fetched",
            data: leaveHistory
        })
    } catch (error) {
        next(error);
    }
}

const approveLeaveRequest = async (req, res, next) => {
    try {

        const { id } =  req.params;
        const leave = await LeaveRequest.findById(id);

        if (!leave) {
            throw new AppError("Leave request not found", 404);
        }

        leave.status = "approved";
        await leave.save();
        res.status(200).json({
            status: "success",
            message: "leave approved" 
        })
 
    } catch (error) {
        next(error);
    }
}

const declineLeaveRequest = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        const leave = await LeaveRequest.findById(id);

        if (!leave) {
            throw new AppError("leave request not found", 404);
        }
        leave.status = "declined";
        leave.decisionNote = note || 'No reason provided';
        await leave.save();

        res.status(200).json({
            status:"success",
            message:"Leave declined"
        })
    } catch (error) {
        next(error);
    }
}

const updateLeavePolicy = async (req, res, next) => {

    try {
        const companyId = req.company._id;
        const { leaveTypes } = req.body;
        let policy = await LeavePolicy.findOne({ company: companyId });
        
        if(!policy) {
            policy = new LeavePolicy({
                company: companyId,
                leaveTypes
            })
        }
        else{
            policy.leaveTypes = leaveTypes
        }

        await policy.save();

        res.status(200).json({
            status:"success",
            message: "Leave Policy update successfully",
            data: policy
        })

    } catch (error) {
        next(error);
    }
}



const getCompanyLeaveReport = async (req, res) => {

    try {
      const companyId = req.company.companyId;
  
      // Find all employees for the company
      const employees = await Employee.find({ company: companyId }).select('_id');
  
      const employeeIds = employees.map(emp => emp._id);
   
      // Fetch all leave requests tied to those employees
      const leaves = await LeaveRequest.find({ employee: { $in: employeeIds } })
        .populate({
          path: 'employee',
          populate: {
            path: 'user',
            model: 'User',
            select: 'firstName lastName email gender'
          }
        })
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        message: 'Company-wide leave report generated',
        data: leaves
      });
  
    } catch (error) {
      console.error('Leave report error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



module.exports = {
    createLeavePolicy,
    requestLeave,
    getEmployeeLeaveHistory,
    getLeaveHistoryByEmployeeId,
    approveLeaveRequest,
    declineLeaveRequest,
    updateLeavePolicy,
    getCompanyLeaveReport
}