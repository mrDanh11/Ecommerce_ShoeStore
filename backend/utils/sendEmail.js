const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // hoặc cấu hình SMTP riêng nếu cần
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ứng dụng Shoea" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent, // gửi nội dung dạng HTML
  });
};

module.exports = sendEmail;
