import axiosInstance from "../../../utils/axiosInstance";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "COUNSELOR" | string;
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  role: string;
}

// ─── GET /auth/users?role=ADMIN ───────────────────────────────────────────────
export const getUsers = async (role?: string): Promise<User[]> => {
  const { data } = await axiosInstance.get<User[]>("/auth/users", {
    params: role ? { role } : {},
  });
  return data;
};

// ─── POST /auth/register ──────────────────────────────────────────────────────
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await axiosInstance.post<User>("/auth/register", payload);
  return data;
};

// ─── PATCH /auth/user/:id ─────────────────────────────────────────────────────
export const updateUserRole = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const { data } = await axiosInstance.patch<User>(`/auth/user/${id}`, payload);
  return data;
};

// ─── DELETE /auth/users/:id ───────────────────────────────────────────────────
export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/auth/users/${id}`);
};
