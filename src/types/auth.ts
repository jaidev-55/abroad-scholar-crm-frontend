export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export type ForgotStep = "email" | "reset" | "success";
