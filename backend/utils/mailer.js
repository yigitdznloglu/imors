const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

// Configure the email transporter using environment variable for the password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  auth: {
    user: "imorsimors@gmail.com", 
    pass: process.env.APP_PASSWORD
  }
});

// Function to send email
const sendEmail = async (userEmail) => {
  const mailOptions = {
    from: '"imörs" <imorsimors@gmail.com>', 
    to: userEmail,
    subject: 'imörs: Your video from imörs has finished generating',
    text: 'Hello! Your imörs video has finished generating! Come check it out!', 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
