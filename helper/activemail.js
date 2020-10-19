const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const response = {
  sendEmail: (email) => {
      const isjwt = jwt.sign({email: email}, '123')
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const link = `${process.env.URL_LOKAL}/user/register/${isjwt}`;
    var mailOptions = {
      from: "as@gmail.com",
      to: email,
      subject: "Sending Email using Nodejs",
      html:
        "Hello,<br> <h2>Please Click on the link to verify your email.</h2><br><a href=" +
        link +
        ">Click here to verify</a>",
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      console.log("Email sent: " + info.response);
    });
  },
};

module.exports = response;
