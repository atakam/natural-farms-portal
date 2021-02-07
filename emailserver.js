const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: "portal.naturalfarms.ca",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'no_reply@portal.naturalfarms.ca', // generated ethereal user
      pass: 'destinY74!', // generated ethereal password
    },
});

module.exports = transporter;