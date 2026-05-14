const Company = require("../models/company");
const Employees = require("../models/employee");
const AppError = require("../utils/AppError");



const getAllEmployees = async(req, res, next) => {
    try {
        const companyId = req.company._id
        const employees = await Employees.find({company: companyId}).populate('user,');
        if (!employees) {
            throw new AppError("Employees not found", 404);
        }
        res.status(200).json({
            status: "success",
            message: "Employees successfully fetched",
            count: employees.length,
            data: employees
        })
    } catch (error) {
        next(error)
    }
};

const getEmployeesByDepartment = async(req, res) => {
    try {
        const companyId = req.company._id;
        const { departmentId } = req.params;

        const employees = await Employees.find({ company: companyId, department: departmentId }).populate("user");

        if (!employees) {
            throw new AppError("Employees not found in this department", 404);
        }

        res.status(200).json({
            status: "success",
            message: "Employess successfully fetched",
            count: employees.length,
            data: employees

        });
    } catch (error) {
        next(error);
    }
}

const getEmployeeDetails = async(req, res, next) => {
    try {
        const companyId = req.company._id;
        const { id } = req.params;
        const employee = await Employees.findOne({_id: id, company: companyId}.populate("user"));

        if (!employee) {
            throw new AppError("employee with this ID not found", 404);
        }
        res.status(200).json({
            status:"success",
            message:"Employee profile successfully fetched",
            data: employee
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllEmployees,
    getEmployeesByDepartment,
    getEmployeeDetails
}