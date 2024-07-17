import { resend } from "@/lib/resend";
import VerificationEmail from "../../Email/verificationEmailTemplete";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "abhiproject03@gmail.com",
      to: email,
      subject: "Anoying-message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: false,
      message: "Verification email send Successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send Verification email",
    };
  }
}
