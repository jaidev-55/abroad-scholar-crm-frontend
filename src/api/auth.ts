import axiosInstance from "../utils/axiosInstance";

// ─── Types ───────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "COUNSELOR";
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
  access_token?: string;
  user?: { id: string; name: string; email: string; role: string };
}

export interface ResendOtpResponse {
  message: string;
}

// ─── API Functions ────────────────────────────────────

export const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const { data } = await axiosInstance.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return data;
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> => {
  const { data } = await axiosInstance.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    payload,
  );
  return data;
};

export const resendOtp = async (
  payload: ResendOtpPayload,
): Promise<ResendOtpResponse> => {
  const { data } = await axiosInstance.post<ResendOtpResponse>(
    "/auth/resend-otp",
    payload,
  );
  return data;
};

// ─── Login ────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token?: string;
  user?: { id: string; name: string; email: string; role: string };
}

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    payload,
  );
  return data;
};

// ─── Forgot Password ──────────────────────────────────

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  const { data } = await axiosInstance.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    payload,
  );
  return data;
};

// ─── Reset Password ───────────────────────────────────

export interface ResetPasswordPayload {
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const { data } = await axiosInstance.post<ResetPasswordResponse>(
    "/auth/reset-password",
    payload,
  );
  return data;
};

// ─── Get Users ────────────────────────────────────────
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const getUsers = async (role?: string): Promise<ApiUser[]> => {
  const { data } = await axiosInstance.get<ApiUser[]>("/auth/users", {
    params: role ? { role } : undefined,
  });
  return data;
};

// ─── Get Current User ─────────────────────────────────
export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const { data } = await axiosInstance.get<CurrentUser>("/auth/me");
  return data;
};

// ─── Update User (self — name + email only) ───────────
export interface UpdateUserPayload {
  name?: string;
  email?: string;
}

export interface UpdateUserResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const updateUser = async (
  _id: string,
  payload: UpdateUserPayload,
): Promise<UpdateUserResponse> => {
  const { data } = await axiosInstance.patch<UpdateUserResponse>(
    "/auth/profile", //
    { name: payload.name, email: payload.email },
  );
  return data;
};

// ─── Change Password (authenticated, no OTP) ──────────
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.patch<{ message: string }>(
    "/auth/change-password",
    payload,
  );
  return data;
};
