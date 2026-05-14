const Department = require("../models/department");
const Employee = require("../models/employee");
const Company = require("../models/company");
const AppError = require("../utils/AppError");

// Create Department
const createDepartment = async (req, res, next) => {
    try {
        console.log(req.user);
        
        const { name } = req.body;
        const companyId = req.user.company?._id

        // Ensure the user creating the department is an HR
        if (req.user.role !== "HR") {
            return next(new AppError("Only HR can create departments", 403));
        }

        // Check if the department already exists in the company
        const existingDept = await Department.findOne({ name, company: companyId });
        if (existingDept) {
            return next(new AppError("Department already exists", 400));
        }

        // Create the department
        const department = new Department({
            name,
            company: companyId,
            createdBy: req.user._id
        });

        await department.save();

        res.status(201).json({
            status: "success",
            message: "Department created successfully",
            department
        });
    } catch (error) {
        next(error);
    }
};

const assignLineManager = async (req, res, next) => {
    try {
        const { departmentId, employeeId } = req.body;
        const companyId = req.user.company; 

        // Ensure the user assigning the line manager is an HR
        // if (req.employee.role !== "hr") {
        //     return next(new AppError("Only HR can assign a line manager", 403));
        // }

        // Ensure department exists within the company
        const department = await Department.findOne({ _id: departmentId, company: companyId });
        if (!department) {
            return next(new AppError("Department not found", 404));
        }

        const employeesCount = await Employee.countDocuments({ company: companyId });
        if (employeesCount === 0) {
            return next(new AppError("Cannot assign a line manager until all employees have been invited", 400));
        }

        // Ensure the employee exists and belongs to the department
        const employee = await Employee.findOne({ _id: employeeId, department: departmentId, company: companyId });
        if (!employee) {
            return next(new AppError("Employee not found in this department", 404));
        }

        // Update the employee's role to "line manager"
        employee.role = "line manager";
        await employee.save();

        // Assign the employee as the department's line manager
        department.lineManager = employeeId;
        await department.save();

        res.status(200).json({
            status: "success",
            message: "Line Manager assigned successfully",
            department,
            updatedEmployee: employee
        });
    } catch (error) {
        next(error);
    }
};

// Fetch all employees in a department
const getDepartmentEmployees = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        const department = await Department.findById(departmentId).populate('employees');
        if (!department) {
            return next(new AppError("Department not found", 404));
        }
        res.status(200).json({
            status: "success",
            message: "Employees fetched successfully",
            employees: department.employees
        });
    } catch (error) {
        next(error);
    }
};

// Remove an employee as line manager from a department
const removeLineManager = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        const department = await Department.findById(departmentId);
        if (!department) {
            return next(new AppError("Department not found", 404));
        }
        department.lineManager = null;
        await department.save();
        res.status(200).json({
            status: "success",
            message: "Line manager removed from department",
            department
        });
    } catch (error) {
        next(error);
    }
};

// Fetch all departments
const getAllDepartments = async (req, res, next) => {
    try {
        const companyId = req.user.company?._id;
        const departments = await Department.find({ company: companyId });
        res.status(200).json({
            status: "success",
            message: "Departments fetched successfully",
            departments
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createDepartment, assignLineManager, getDepartmentEmployees, removeLineManager, getAllDepartments };