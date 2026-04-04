import { useState } from "react";
import { message, Skeleton } from "antd";
import {
  FiUser,
  FiMail,
  FiShield,
  FiEdit2,
  FiLock,
  FiX,
  FiCheckCircle,
  FiCopy,
  FiLogOut,
  FiKey,
} from "react-icons/fi";
import { RiLoader4Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CustomModal from "../../components/common/CustomModal";
import CustomInput from "../../components/common/CustomInput";
import { getCurrentUser, updateUser, changePassword } from "../../api/auth";

interface EditProfileFormValues {
  name: string;
  email: string;
}

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Config ───────────────────────────────────────────
const ROLE_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; label: string; desc: string }
> = {
  ADMIN: {
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Administrator",
    desc: "Full access to all portal features & settings",
  },
  COUNSELOR: {
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    label: "Counselor",
    desc: "Access to student pipeline, batches & counselling tools",
  },
};

const getRoleConfig = (role: string) =>
  ROLE_CONFIG[role] || {
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    label: role,
    desc: "Standard access",
  };

const AVATAR_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
];
const getAvatarColor = (str: string) =>
  AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Password strength ────────────────────────────────
const getStrength = (pw: string) => {
  if (!pw) return { label: "", color: "", width: "0%" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { label: "Weak", color: "#ef4444", width: "20%" };
  if (s <= 2) return { label: "Fair", color: "#f59e0b", width: "40%" };
  if (s <= 3) return { label: "Good", color: "#3b82f6", width: "65%" };
  return { label: "Strong", color: "#22c55e", width: "100%" };
};

// ─── MAIN COMPONENT ───────────────────────────────────
const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Fetch current user ────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  // ── Edit profile mutation ─────────────────────────
  const { mutate: saveProfile, isPending: editLoading } = useMutation({
    mutationFn: (data: EditProfileFormValues) =>
      updateUser(profile!.id, { name: data.name, email: data.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      message.success("Profile updated successfully!");
      setEditOpen(false);
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } } };
      message.error(e?.response?.data?.message || "Failed to update profile.");
    },
  });

  // ── Change password mutation ──────────────────────
  const { mutate: savePassword, isPending: passwordLoading } = useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      message.success("Password changed successfully!");
      setPasswordOpen(false);
      resetPasswordForm();
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } } };

      message.error(e?.response?.data?.message || "Failed to change password.");
    },
  });

  // ── Forms ─────────────────────────────────────────
  const {
    handleSubmit: handleEditSubmit,
    control: editControl,
    reset: resetEditForm,
  } = useForm<EditProfileFormValues>({
    defaultValues: { name: "", email: "" },
  });

  const {
    handleSubmit: handlePasswordSubmit,
    control: passwordControl,
    reset: resetPasswordForm,
    watch,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword", "");
  const strength = getStrength(newPassword);
  const roleConfig = getRoleConfig(profile?.role || "");

  const openEdit = () => {
    resetEditForm({
      name: profile?.name ?? displayName ?? "",
      email: profile?.email ?? "",
    });
    setEditOpen(true);
  };

  const copyId = () => {
    if (!profile?.id) return;
    navigator.clipboard.writeText(profile.id);
    setCopied(true);
    message.success("User ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
          <Skeleton avatar active paragraph={{ rows: 3 }} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  const displayName = profile?.name || profile?.email?.split("@")[0] || "User";

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      {/* ── PAGE HEADER ── */}
      <div className="mb-6">
        <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
          My Profile
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          View and manage your account information
        </p>
      </div>

      {/* ── HERO CARD ── */}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
        {/* Banner */}
        <div
          className="h-32 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
          }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.10) 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Decorative blobs */}
          <div
            className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10"
            style={{ filter: "blur(25px)" }}
          />
          <div
            className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full bg-white/10"
            style={{ filter: "blur(20px)" }}
          />

          {/* Name + email overlay on banner */}
          <div className="absolute bottom-4 left-[104px] right-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-black text-white leading-tight drop-shadow">
                {displayName}
              </h2>
              <p className="text-[12px] text-white/70 mt-0.5">
                {profile?.email}
              </p>
            </div>
            <button
              onClick={openEdit}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-[12px] font-semibold text-white cursor-pointer transition-all shrink-0 backdrop-blur-sm"
            >
              <FiEdit2 size={12} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Avatar + role badge */}
        <div className="px-5 pb-4 relative">
          {/* Avatar overlapping banner */}
          <div className="absolute -top-9 left-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl ring-[3px] ring-white"
              style={{ backgroundColor: getAvatarColor(displayName) }}
            >
              {getInitials(displayName)}
            </div>
          </div>

          {/* Role badge — pushed right of avatar */}
          <div className="pt-10 pl-1 flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
              style={{
                color: roleConfig.color,
                backgroundColor: roleConfig.bg,
                borderColor: roleConfig.border,
              }}
            >
              <FiShield size={11} />
              {roleConfig.label}
            </span>
            <span className="text-[11px] text-slate-400">
              {roleConfig.desc}
            </span>
          </div>
        </div>
      </div>

      {/* ── INFO GRID ── */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Role card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: roleConfig.bg,
                color: roleConfig.color,
              }}
            >
              <FiShield size={15} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Role
            </p>
          </div>
          <p
            className="text-[15px] font-bold"
            style={{ color: roleConfig.color }}
          >
            {roleConfig.label}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {roleConfig.desc}
          </p>
        </div>

        {/* User ID card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <FiUser size={15} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              User ID
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-[11px] font-mono text-slate-700 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100 truncate flex-1">
              {profile?.id}
            </code>
            <button
              onClick={copyId}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer"
              style={{
                borderColor: copied ? "#bfdbfe" : "#e2e8f0",
                backgroundColor: copied ? "#eff6ff" : "transparent",
              }}
            >
              {copied ? (
                <FiCheckCircle size={13} className="text-blue-500" />
              ) : (
                <FiCopy size={13} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── ACCOUNT DETAILS ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50">
          <h3 className="text-[13px] font-bold text-slate-800">
            Account Details
          </h3>
          <button
            onClick={openEdit}
            className="text-[12px] font-semibold text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer transition-colors"
          >
            Edit
          </button>
        </div>
        <div>
          {[
            {
              icon: <FiUser size={14} />,
              label: "Full Name",
              value: displayName,
              color: "#3b82f6",
              bg: "#eff6ff",
            },
            {
              icon: <FiMail size={14} />,
              label: "Email Address",
              value: profile?.email ?? "—",
              color: "#6366f1",
              bg: "#f5f3ff",
            },
            {
              icon: <FiShield size={14} />,
              label: "Role",
              value: roleConfig.label,
              color: roleConfig.color,
              bg: roleConfig.bg,
            },
            {
              icon: <FiCheckCircle size={14} />,
              label: "Account Status",
              value: "Active",
              color: "#059669",
              bg: "#ecfdf5",
              badge: true,
            },
          ].map(({ icon, label, value, color, bg, badge }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors ${i > 0 ? "border-t border-slate-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg, color }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-[13px] font-semibold text-slate-800 mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
              {badge && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5"
                  style={{ color, backgroundColor: bg }}
                >
                  <FiCheckCircle size={10} /> Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── SECURITY ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-50">
          <h3 className="text-[13px] font-bold text-slate-800">Security</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {/* Change password */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                <FiKey size={14} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">
                  Password
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Keep your account secure with a strong password
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                resetPasswordForm();
                setPasswordOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all shadow-sm"
            >
              <FiLock size={11} /> Change
            </button>
          </div>

          {/* Sign out */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                <FiLogOut size={14} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">
                  Sign Out
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sign out from your current session
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-[12px] font-semibold text-red-600 hover:bg-red-100 cursor-pointer transition-all"
            >
              <FiLogOut size={11} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      <CustomModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          resetEditForm();
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <FiEdit2 size={16} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">
                Edit Profile
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Update your account information
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditOpen(false);
              resetEditForm();
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer border-none bg-transparent transition-colors"
          >
            <FiX size={15} className="text-slate-400" />
          </button>
        </div>
        <form
          onSubmit={handleEditSubmit((d) => saveProfile(d))}
          className="px-6 py-5 flex flex-col gap-4"
        >
          <CustomInput
            name="name"
            label="Full Name"
            placeholder="Your full name"
            control={editControl}
            type="text"
            icon={<FiUser size={13} className="text-slate-300" />}
            rules={{
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            }}
          />
          <CustomInput
            name="email"
            label="Email Address"
            placeholder="your@email.com"
            control={editControl}
            type="email"
            icon={<FiMail size={13} className="text-slate-300" />}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
          />
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setEditOpen(false);
                resetEditForm();
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-bold border-none cursor-pointer hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {editLoading ? (
                <>
                  <RiLoader4Line size={14} className="animate-spin" /> Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* ── CHANGE PASSWORD MODAL ── */}
      <CustomModal
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          resetPasswordForm();
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <FiLock size={16} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">
                Change Password
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Choose a strong, unique password
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPasswordOpen(false);
              resetPasswordForm();
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer border-none bg-transparent transition-colors"
          >
            <FiX size={15} className="text-slate-400" />
          </button>
        </div>
        <form
          onSubmit={handlePasswordSubmit((d) => savePassword(d))}
          className="px-6 py-5 flex flex-col gap-4"
        >
          <CustomInput
            name="currentPassword"
            label="Current Password"
            placeholder="Enter current password"
            control={passwordControl}
            type="password"
            icon={<FiLock size={13} className="text-slate-300" />}
            rules={{ required: "Current password is required" }}
          />
          <div>
            <CustomInput
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              control={passwordControl}
              type="password"
              icon={<FiLock size={13} className="text-slate-300" />}
              rules={{
                required: "New password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              }}
            />
            {newPassword && (
              <div className="mt-2 px-0.5">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: strength.width,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
                <p
                  className="text-[11px] font-semibold mt-1"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </p>
              </div>
            )}
          </div>
          <CustomInput
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            control={passwordControl}
            type="password"
            icon={<FiLock size={13} className="text-slate-300" />}
            rules={{
              required: "Please confirm your password",
              validate: (v: string) =>
                v === watch("newPassword") || "Passwords do not match",
            }}
          />
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setPasswordOpen(false);
                resetPasswordForm();
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-bold border-none cursor-pointer hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <RiLoader4Line size={14} className="animate-spin" /> Updating…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default ProfilePage;
