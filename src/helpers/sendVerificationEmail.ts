import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username:string,
    verificationCode: string,
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code of MysteryMessage',
            react: VerificationEmail({username, otp:verificationCode}),
          });
        return {success: true, message: "Email sent successfully!"};
    } catch (error) {
        console.log("Error sending verification email:", error);
        return {
            success: false,
            message: "Error sending verification email",
        }
    }
}