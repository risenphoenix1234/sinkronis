const Joi = require('joi');

const invitationValidationSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(5).max(20).required(),
  role: Joi.string().valid("Admin", "User").required(),
});

module.exports = { invitationValidationSchema };
