// utils/nodemailer.js
const nodemailer = require('nodemailer');

// Configure the transport for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can replace this with your own service, e.g., Outlook, SendGrid, etc.
  auth: {
    user: 'dudhwalekaran@gmail.com', // Replace with your email
    pass: 'ibol lukc gksy oubu', // Replace with your email password
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'dudhwalekaran@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
