const Appraisal = require("../models/appraisal");
const Employee = require("../models/employee");
const AppError = require("../utils/AppError");

const createAppraisal = async (req, res, next) => {
  try {
    const { objectives, monthlyKPIs, selfOverallRating, selfSummary, reviewPeriod } = req.body;

    if (!objectives || !monthlyKPIs || !reviewPeriod) {
      throw new AppError("Objectives, monthly KPIs, and review period are required.", 400);
    }

    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      throw new AppError("Employee not found.", 404);
    }

    const newAppraisal = await Appraisal.create({
      employee: employee._id,
      objectives,
      monthlyKPIs,
      selfOverallRating,
      selfSummary,
      reviewPeriod,
      status: "draft"
    });

    if(!newAppraisal){
      throw new AppError("New appraisal not created",403);
    }

    res.status(201).json({ 
      status: "success",
      message: "Appraisal saved as draft.", 
      appraisal: newAppraisal 
    });
  } catch (error) {
    next(error);
  }
};

const managerReview = async (req, res, next) => {
  try {
    // const { error, value } = managerReviewSchema.validate(req.body);
    // if (error) {
    //   throw new AppError(error.details.map(d => d.message).join(", "), 400);
    // }

    const appraisalId = req.params.id;
    const appraisal = await Appraisal.findById(appraisalId);
    if (!appraisal) {
      throw new AppError("Appraisal not found.", 404);
    }

    // Optional file upload
    let attachmentPath;
    if (req.file) {
      attachmentPath = req.file.path; // or save req.file.filename or a URL
    }

    appraisal.managerComments = value.managerComments;
    appraisal.managerRating = value.managerRating;
    if (attachmentPath) {
      appraisal.managerAttachment = attachmentPath;
    }
    appraisal.status = "reviewed";

    await appraisal.save();

    res.status(200).json({
      status: "success",
      message: "Appraisal reviewed successfully.",
      appraisal
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createAppraisal,
  managerReview
};
