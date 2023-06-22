import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    service: "gmail",
    port: 2525,
    auth: {
      // user: process.env.SMTP_EMAIL,
      // pass: process.env.SMTP_PASSWORD,
      user: process.env.SMTPMAIL,
      pass: process.env.SMTPMAILPASS,
    },
  });
  const message = {
    from: options.from ? options.from : `Bolumna <${process.env.SMTPMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
};
export default sendEmail;
