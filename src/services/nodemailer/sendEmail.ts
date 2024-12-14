import * as nodemailer from 'nodemailer';

// Create a nodemailer transporter using your email service provider's credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vikastiwarisync@gmail.com', // Replace with your Gmail email address
    pass: 'jvle ndau fmrr eqbg', // Replace with your Gmail email password or an app password
  },
  secure: false,
});
// Function to send an email
export const sendEmail = (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: 'vikastiwarisync@gmail.com', // Replace with your Gmail email address
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info.response);
      }
    });
  });
};
