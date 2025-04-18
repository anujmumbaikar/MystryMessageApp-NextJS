import nodemailer from 'nodemailer';
import { ApiResponse } from "@/types/ApiResponse";

// Setup transporter (can be in a separate file too)
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your App Password
  },
});

// This is a simple email template — you can replace it with your JSX/HTML version
const generateEmailHTML = (username: string, otp: string) => {
  return `
    <div>
      <h2>Hello, ${username}!</h2>
      <p>Your verification code is:</p>
      <h3 style="color: blue;">${otp}</h3>
      <p>Please use this code to verify your email for MysteryMessage.</p>
    </div>
  `;
};

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Code for MysteryMessage',
      html: generateEmailHTML(username, verificationCode),
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Error sending verification email',
    };
  }
}
