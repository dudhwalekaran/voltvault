import nodemailer from 'nodemailer';

export async function sendEmail(to, subject, text) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Password,
      },
    });

    let info = await transporter.sendMail({
      from: `"dudhwalekaran@gmail.com" <${process.env.Email_User}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
