const Query = require("../models/query");
const Employee = require("../models/employee");
const { validateQueryInput } = require("../validation/query");
const AppError = require("../utils/AppError");


const createQuery = async (req, res, next) => {
    try {
        const { error, value } = validateQueryInput(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { employeeId, type, note } = value;

         if (!['manager', 'hr'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        const query = await Query.create({
        employee: employeeId,
        issuedBy: req.user._id,
        type,
        note,
        status: 'issued',
        });

        return res.status(201).json({ 
            status:"success", 
            message: 'Query created',
            data: query
         });
    } catch (error) {
        next(error)
        
    }
}


const respondToQuery = async (req, res, next) => {
    try {
        const { queryId } = req.params;
        const { response } = req.body;
        
    if (!response || response.trim().length < 5) {
      throw new AppError("Response is required and must be meaningful", 400);
    }

    const query = await Query.findById(queryId);

    if (!query) {
      throw new AppError("Query not found", 404);
    }

    if (query.employee.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized to respond to this query", 403);
    }

    query.response = response;
    query.status = 'opened';
    query.respondedAt = new Date();

    await query.save();

    return res.status(200).json({ success: true, message: 'Query response submitted', data: query });
    } catch (error) {
        next(error);
    }
}



const resolveQuery = async(req, res, next) => {
    try {
        const { queryId } = req.params;
    const { resolutionNote } = req.body;

    const query = await Query.findById(queryId);
    if (!query) {
      throw new AppError("Query not found", 4040)
    }

    if (!['manager', 'hr'].includes(req.user.role)) {
      throw new AppError("Unauthorized to resolve this query", 403);
    }

    query.status = 'resolved';
    query.resolutionNote = resolutionNote || 'Resolved';
    query.resolvedAt = new Date();
    query.resolvedBy = req.user._id;

    await query.save();

    return res.status(200).json({ 
        success: true, 
        message: 'Query resolved', 
        data: query 
    });
    } catch (error) {
        next(error)
    }
}


const getEmployeeQueries = async (req, res, next) => {
  try {
    const queries = await Query.find({ employee: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: queries });
  } catch (error ) {
    next(error)
  }
};

module.exports = {
    createQuery,
    respondToQuery,
    resolveQuery,
    getEmployeeQueries
}
