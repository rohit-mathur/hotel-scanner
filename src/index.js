const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  tls: {
    minVersion: "TLSv1",
    rejectUnauthorized: false,
    ignoreTLS: false,
    requireTLS: true
  },
  auth: {
    user: "mathur232@gmail.com", // generated ethereal user
    pass: "Steel@1234" // generated ethereal password
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve(__dirname, "views"),
    defaultLayout: false
  },
  viewPath: path.resolve(__dirname, "views"),
  extName: ".handlebars"
};

transporter.use("compile", hbs(handlebarOptions));

app.post("/sendCheckInEmail", (req, res) => {
  const emailInfo = req.body;
  emailInfo.template = "checkin";
  main(emailInfo).catch(console.error);
  res.status(201).send("Sent");
});

app.post("/sendInvoiceEmail", (req, res) => {
  const emailInfo = {
    from: "mathur232@gmail.com",
    to: req.body.to,
    subject: `[Invoice] Travellers Nest Manali - ${req.body.invoiceNumber}`,
    template: "invoice",
    context: req.body
  };
  main(emailInfo).catch(console.error);
  res.status(200).send("Sent");
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log("test"));

// async..await is not allowed in global scope, must use a wrapper
async function main(data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport

  // send mail with defined transport object
  let info = await transporter.sendMail(data);
  console.log("info", info);
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
