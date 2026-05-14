const Employee = require('../models/employee');
const Suspension = require('../models/suspension');
const AppError = require('../utils/AppError');

// Suspend an employee
const suspendEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { reason, endDate } = req.body;
    const userId = req.user._id;

    const employee = await Employee.findById(employeeId);
    if (!employee) throw new AppError('Employee not found', 404);
    if (employee.status === 'suspended') throw new AppError('Employee is already suspended', 400);

    const suspension = await Suspension.create({
      employee: employee._id,
      suspendedBy: userId,
      reason,
      startDate: new Date(),
      endDate: endDate || null,
      status: 'active',
    });

    employee.status = 'suspended';
    employee.currentSuspension = suspension._id;
    await employee.save();

    res.status(201).json({
      status: 'success',
      message: 'Employee suspended successfully',
      suspension,
    });
  } catch (err) {
    next(err);
  }
};

// Resume a suspended employee
const resumeEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId).populate('currentSuspension');
    if (!employee || employee.status !== 'suspended') {
      throw new AppError('Employee is not currently suspended', 400);
    }

    const suspension = await Suspension.findById(employee.currentSuspension._id);
    if (!suspension) throw new AppError('Suspension record not found', 404);
    if (suspension.status === 'resolved') throw new AppError('Suspension is already resolved', 400);

    suspension.status = 'resolved';
    suspension.endDate = new Date();
    await suspension.save();

    employee.status = 'active';
    employee.currentSuspension = null;
    await employee.save();

    res.status(200).json({
      status: 'success',
      message: 'Employee resumed successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Get all suspensions
const getAllSuspensions = async (req, res, next) => {
  try {
    const suspensions = await Suspension.find()
      .populate('employee', 'firstName lastName email status')
      .populate('suspendedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: suspensions.length,
      data: suspensions,
    });
  } catch (err) {
    next(err);
  }
};

// Get all suspensions for a specific employee
const getEmployeeSuspensions = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const suspensions = await Suspension.find({ employee: employeeId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: suspensions.length,
      data: suspensions,
    });
  } catch (err) {
    next(err);
  }
};

// Auto resume employees whose endDate has passed (for cron job)
const autoResumeSuspendedEmployees = async () => {
  const now = new Date();

  const suspensions = await Suspension.find({
    status: 'active',
    endDate: { $lte: now },
  });

  for (const suspension of suspensions) {
    const employee = await Employee.findById(suspension.employee);
    if (!employee) continue;

    employee.status = 'active';
    employee.currentSuspension = null;
    await employee.save();

    suspension.status = 'resolved';
    await suspension.save();
  }

  console.log(`${suspensions.length} employees auto-resumed`);
};


module.exports = {
  suspendEmployee,
  resumeEmployee,
  getAllSuspensions,
  getEmployeeSuspensions,
  autoResumeSuspendedEmployees
}