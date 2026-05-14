const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/company");
const Employee = require("../models/employee");
const User  = require("../models/user");
const { sendEmail } = require("../utils/email"); 
const cloudinary = require("cloudinary").v2;
const csvParser = require("csv-parser");
const streamifier = require("streamifier");



// hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// compare passwords
const comparePassword = async (inputPassword, storedHash) => {
  return await bcrypt.compare(inputPassword, storedHash);
};

// Generate Token
const signJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Check if company already exists
const checkCompanyExists = async (email) => {
  return await Company.findOne({ email });
};

// Create a new company
const createCompany = async (data) => {
  const company = new Company(data);
  return await company.save();
};

// Check if user already exists
const checkUserExists = async (email) => {
  return await User.findOne({ email });
};

// Create a new user
const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

// Create an employee record
const createEmployee = async (data) => {
  const employee = new Employee(data);
  return await employee.save();
};

// Send company welcome email
const sendCompanyWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Our Platform!";
  const message = `Hello ${name}, welcome to our platform!`;
  return await sendEmail(email, subject, message);
};

// Send invitation email
const sendInvitationEmail = async (email, firstName, token) => {
  const subject = "You're Invited!";
  const message = `Hello ${firstName}, please click the link to activate your account: ${process.env.FRONTEND_URL}/activate/${token}`;
  return await sendEmail(email, subject, message);
};

// Find a user or company by email
const findUserOrCompany = async (email) => {
  return await User.findOne({ email }) || await Company.findOne({ email });
};

// Find a pending employee by email
const findPendingEmployee = async (email) => {
  return await Employee.findOne({ email, status: "pending" });
};

// Activate employee account
const activateEmployee = async (employee, hashedPassword) => {
  employee.password = hashedPassword;
  employee.status = "active";
  return await employee.save();
};

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Save OTP for password reset
const saveOtp = async (user, otp) => {
  user.resetOtp = otp;
  user.otpExpires = Date.now() + 15 * 60 * 1000; // Expires in 15 mins
  return await user.save();
};

// Verify OTP
const verifyOtp = async (user, otp) => {
  return user.resetOtp === otp && user.otpExpires > Date.now();
};

// Update password
const updatePassword = async (user, newPassword) => {
  user.password = await hashPassword(newPassword);
  user.resetOtp = null;
  user.otpExpires = null;
  return await user.save();
};



// Upload CSV to Cloudinary from memory
const uploadCsvToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "csv_uploads" }, // Store in a specific folder
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};


const bulkInviteEmployees = async (file, companyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file) {
                return reject(new Error("No file uploaded"));
            }

            // Upload CSV to Cloudinary
            const cloudinaryUrl = await uploadCsvToCloudinary(file.buffer);
            console.log("Uploaded CSV URL:", cloudinaryUrl);

            // Process CSV from Cloudinary
            const employees = [];
            const response = await fetch(cloudinaryUrl);
            const csvStream = response.body.pipe(csvParser());

            csvStream.on("data", (row) => {
                employees.push(row);
            });

            csvStream.on("end", async () => {
                try {
                    const invitedEmployees = [];

                    for (const employeeData of employees) {
                        const { firstName, lastName, email, department } = employeeData;

                        if (!firstName || !lastName || !email || !department) {
                            continue; 
                        }

                        const existingUser = await checkUserExists(email);
                        const existingEmployee = await findPendingEmployee(email);

                        if (!existingUser && !existingEmployee) {
                            const newEmployee = await createEmployee({
                                firstName,
                                lastName,
                                email,
                                department,
                                company: companyId,
                                status: "pending",
                            });

                            const token = signJwt({ id: newEmployee._id, email });
                            await sendInvitationEmail(email, firstName, token);

                            invitedEmployees.push(newEmployee);
                        }
                    }

                    resolve(invitedEmployees);
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
  hashPassword,
  comparePassword,
  signJwt,
  checkCompanyExists,
  createCompany,
  checkUserExists,
  createUser,
  createEmployee,
  sendCompanyWelcomeEmail,
  sendInvitationEmail,
  findUserOrCompany,
  findPendingEmployee,
  activateEmployee,
  generateOtp,
  saveOtp,
  verifyOtp,
  updatePassword,
  bulkInviteEmployees
};
