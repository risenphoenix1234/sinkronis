const axios = require("axios");
const Payment = require("../models/payment");
const Company = require("../models/company");
const AppError = require("../utils/AppError");



const priceMapping = {
  HRIS: 8000000,             
  Payroll: 1000000,          
  Accounting: 8000000,       
  HRIS_Payroll: 9000000,    
  HRIS_Accounting: 16000000,  
  Payroll_Accounting: 9000000,
  HRIS_Payroll_Accounting: 17000000, 
  Allinone: 15000000,         
}; 



const initializePayment = async (req, res, next) => {
  try {
    const { email } = req.body;
    const companyId = req.companyId; 

    if (!companyId) {
      return next(new AppError("Company ID missing from request.", 400));
    }
    // console.log(planType);
    // if (!planType || !priceMapping[planType]) {
    //   return next(new AppError("Invalid plan selected", 400));
    // }
    if (!email) {
      return next(new AppError("Company email is required", 400));
    }

    // const amount = priceMapping[planType];
    const amount = 15000000;
    const callbackUrl = process.env.CALLBACK_URL;  

    

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const paymentUrl = process.env.PAYMENT_URL;
    const response = await axios.post(
      `${paymentUrl}/transaction/initialize`,
      {
        email,
        amount,
        callback_url: callbackUrl,
        metadata: {
          companyId,
          // planType,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url, reference } = response.data.data;

    

    // await Payment.create({
    //   company: companyId,
    //   // planId: planType, 
    //   amount,
    //   currency: "NGN",
    //   paymentGateway: "Paystack",
    //   transactionReference: reference,
    //   status: "pending",
    //   metadata: response.data.data,
    // });

    res.status(200).json({
      status: "success",
      authorization_url,
    });
  } catch (error) {
    console.error("Payment initialization error:", error.response?.data || error.message);
    next(new AppError("Failed to initialize payment", 500));
  }
};

const verifyPayment = async (req, res, next) => {
    try {
      const { reference } = req.query;
      if (!reference) {
        return next(new AppError("Transaction reference is missing", 400));
      }
  
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      const paymentUrl = process.env.PAYMENT_URL
      const response = await axios.get(`${paymentUrl}/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      });
  
      const data = response.data.data;
      if (data.status !== "success") {
        return next(new AppError("Payment was not successful", 400));
      }
  
      const { companyId, planType } = data.metadata;
  
      // Update or create a Payment record (code omitted for brevity)
      await Payment.findOneAndUpdate(
        { transactionReference: reference },
        {
          company: companyId,
          planId: planType,
          amount: data.amount,
          currency: data.currency,
          transactionReference: reference,
          status: "successful",
          metadata: data,
        },
        { upsert: true, new: true }
      );
  
      // Calculate new subscription expiry (30 days from now)
      const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
      // Update the company's planType and subscriptionExpiry
      await Company.findByIdAndUpdate(companyId, {
        planType,
        subscriptionExpiry: newExpiry,
      });
  
      res.status(200).json({
        status: "success",
        message: "Payment verified and subscription updated successfully",
      });
    } catch (error) {
      console.error("Payment verification error:", error.response?.data || error.message);
      next(new AppError("Payment verification failed", 500));
    }
  };
  

module.exports = { initializePayment, verifyPayment };
