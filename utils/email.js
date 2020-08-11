const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2) Define email options:
  const emailOptions = {
    from: 'Brahim Akarouch <brahim.akarouch@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actualy send the email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
