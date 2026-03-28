import { useState, useEffect } from "react";
import { Button, message, Skeleton } from "antd";
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
} from "react-icons/fi";
import { useForm } from "react-hook-form";

import CustomModal from "../../components/common/CustomModal";
import CustomInput from "../../components/common/CustomInput";

const API_BASE = "http://localhost:3000";

interface UserProfile {
  id: string;
  email: string;
  role: "ADMIN" | "COUNSELOR" | string;
  name?: string;
}

interface EditProfileFormValues {
  name: string;
  email: string;
}

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

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

const getAvatarColor = (name: string) => {
  const colors = [
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#0ea5e9",
    "#14b8a6",
    "#f59e0b",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // ─── Fetch profile ───
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data: UserProfile = await res.json();
        setProfile(data);
      } catch {
        setProfile({
          id: "50d51d86-e099-4000-89d0-13aca3ed44f5",
          name: "Jai Prakash",
          email: "jaideveloper2023@gmail.com",
          role: "ADMIN",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ─── Edit profile ───
  const onEditProfile = async (data: EditProfileFormValues) => {
    if (!profile) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/user/${profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: data.name, email: data.email }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setProfile((prev) =>
        prev ? { ...prev, name: data.name, email: data.email } : prev,
      );
      message.success("Profile updated successfully!");
      setEditOpen(false);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Change password ───
  const onChangePassword = async (data: ChangePasswordFormValues) => {
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      if (!res.ok) throw new Error("Failed to change password");
      message.success("Password changed successfully!");
      setPasswordOpen(false);
      resetPasswordForm();
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Password change failed",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const openEditModal = () => {
    if (profile) {
      resetEditForm({ name: profile.name || "", email: profile.email });
    }
    setEditOpen(true);
  };

  const copyId = () => {
    if (profile?.id) {
      navigator.clipboard.writeText(profile.id);
      setCopied(true);
      message.success("User ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Password strength
  const newPassword = watch("newPassword", "");
  const getStrength = (pw: string) => {
    if (!pw) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "#ef4444", width: "20%" };
    if (score <= 2) return { label: "Fair", color: "#f59e0b", width: "40%" };
    if (score <= 3) return { label: "Good", color: "#3b82f6", width: "65%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  };
  const strength = getStrength(newPassword);
  const roleConfig = getRoleConfig(profile?.role || "");

  if (loading) {
    return (
      <div className="px-6 py-8">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-44">
      {/*  Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1a2540] m-0">
          My Profile
        </h1>
        <p className="text-sm text-[#8a95b0] mt-1 m-0">
          View and manage your account information
        </p>
      </div>

      {/* ═══ Profile Hero Card ═══ */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        {/* Gradient Banner */}
        <div
          className="h-32 relative"
          style={{
            background:
              "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          />
          {/* Decorative blobs */}
          <div
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              background: "rgba(255,255,255,0.08)",
              top: -40,
              right: 60,
              filter: "blur(30px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 100,
              height: 100,
              background: "rgba(255,255,255,0.06)",
              bottom: -20,
              left: 120,
              filter: "blur(25px)",
            }}
          />
        </div>

        {/* Profile Info Section */}
        <div className="relative px-6 pb-6">
          {/* Avatar - positioned to overlap banner */}
          <div className="relative -mt-12 mb-4">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white"
              style={{
                backgroundColor: getAvatarColor(profile?.name || "U"),
              }}
            >
              {getInitials(profile?.name || "User")}
            </div>
          </div>

          {/* Name, email, and actions */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#1a2540] m-0 leading-tight">
                {profile?.name || "—"}
              </h2>
              <p className="text-sm text-[#8a95b0] m-0 mt-1">
                {profile?.email}
              </p>
              {/* Role badge inline */}
              <div className="mt-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                  style={{
                    color: roleConfig.color,
                    backgroundColor: roleConfig.bg,
                    border: `1px solid ${roleConfig.border}`,
                  }}
                >
                  <FiShield size={12} />
                  {roleConfig.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                icon={<FiEdit2 size={14} />}
                onClick={openEditModal}
                className="flex items-center gap-2"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Two Column Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Role Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: roleConfig.bg,
                color: roleConfig.color,
              }}
            >
              <FiShield size={18} />
            </div>
            <p className="text-xs font-semibold text-[#8a95b0] m-0 uppercase tracking-wider">
              Role
            </p>
          </div>
          <p
            className="text-lg font-bold m-0"
            style={{ color: roleConfig.color }}
          >
            {roleConfig.label}
          </p>
          <p className="text-xs text-[#8a95b0] m-0 mt-1.5 leading-relaxed">
            {roleConfig.desc}
          </p>
        </div>

        {/* User ID Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">
              <FiUser size={18} />
            </div>
            <p className="text-xs font-semibold text-[#8a95b0] m-0 uppercase tracking-wider">
              User ID
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-[13px] font-mono font-medium text-[#1a2540] m-0 truncate block flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              {profile?.id}
            </code>
            <button
              onClick={copyId}
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200 shrink-0"
              style={{
                backgroundColor: copied ? "#eff6ff" : "transparent",
                borderColor: copied ? "#bfdbfe" : undefined,
              }}
            >
              {copied ? (
                <FiCheckCircle size={14} className="text-blue-500" />
              ) : (
                <FiCopy size={14} className="text-[#8a95b0]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Account Details ═══ */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1a2540] m-0">
            Account Details
          </h3>
          <button
            onClick={openEditModal}
            className="text-xs font-semibold text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
          >
            Edit
          </button>
        </div>

        <div>
          {[
            {
              icon: <FiUser size={16} />,
              label: "Full Name",
              value: profile?.name || "—",
              color: "#3b82f6",
              bg: "#eff6ff",
            },
            {
              icon: <FiMail size={16} />,
              label: "Email Address",
              value: profile?.email || "—",
              color: "#6366f1",
              bg: "#f5f3ff",
            },
            {
              icon: <FiShield size={16} />,
              label: "Role",
              value: roleConfig.label,
              color: roleConfig.color,
              bg: roleConfig.bg,
            },
            {
              icon: <FiCheckCircle size={16} />,
              label: "Account Status",
              value: "Verified",
              color: "#059669",
              bg: "#ecfdf5",
              isBadge: true,
            },
          ].map(({ icon, label, value, color, bg, isBadge }, index) => (
            <div
              key={label}
              className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors duration-150 ${
                index > 0 ? "border-t border-gray-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg, color }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-[11px] text-[#8a95b0] m-0 font-medium uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-[#1a2540] m-0 mt-0.5">
                    {value}
                  </p>
                </div>
              </div>

              {isBadge && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1"
                  style={{
                    color,
                    backgroundColor: bg,
                  }}
                >
                  <FiCheckCircle size={11} />
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Security ═══ */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#1a2540] m-0">Security</h3>
        </div>

        <div className="divide-y divide-gray-50">
          {/* Change Password */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 text-amber-500">
                <FiLock size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2540] m-0">
                  Password
                </p>
                <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                  Keep your account secure with a strong password
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetPasswordForm();
                setPasswordOpen(true);
              }}
              size="small"
              className="flex items-center gap-1.5 shrink-0"
            >
              <FiLock size={12} />
              Change
            </Button>
          </div>

          {/* Logout */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50 text-red-500">
                <FiLogOut size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2540] m-0">
                  Sign Out
                </p>
                <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                  Sign out from your current session
                </p>
              </div>
            </div>
            <Button
              danger
              size="small"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="flex items-center gap-1.5 shrink-0"
            >
              <FiLogOut size={12} />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ Edit Profile Modal ═══ */}
      <CustomModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          resetEditForm();
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <FiEdit2 size={18} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a2540] m-0">
                Edit Profile
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                Update your account information
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditOpen(false);
              resetEditForm();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200"
          >
            <FiX size={16} className="text-[#8a95b0]" />
          </button>
        </div>

        <form
          onSubmit={handleEditSubmit(onEditProfile)}
          className="px-6 py-5 space-y-4"
        >
          <CustomInput<EditProfileFormValues>
            name="name"
            label="Full Name"
            placeholder="Your full name"
            control={editControl}
            size="large"
            type="text"
            icon={<FiUser size={14} className="text-[#b4bcd4]" />}
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
          />

          <CustomInput<EditProfileFormValues>
            name="email"
            label="Email Address"
            placeholder="your@email.com"
            control={editControl}
            size="large"
            type="email"
            icon={<FiMail size={14} className="text-[#b4bcd4]" />}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
          />

          <div className="flex gap-3 pt-3">
            <Button
              block
              size="large"
              onClick={() => {
                setEditOpen(false);
                resetEditForm();
              }}
            >
              Cancel
            </Button>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={editLoading}
            >
              {!editLoading && "Save Changes"}
            </Button>
          </div>
        </form>
      </CustomModal>

      {/* ═══ Change Password Modal ═══ */}
      <CustomModal
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          resetPasswordForm();
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <FiLock size={18} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a2540] m-0">
                Change Password
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                Choose a strong, unique password
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPasswordOpen(false);
              resetPasswordForm();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200"
          >
            <FiX size={16} className="text-[#8a95b0]" />
          </button>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onChangePassword)}
          className="px-6 py-5 space-y-4"
        >
          <CustomInput<ChangePasswordFormValues>
            name="currentPassword"
            label="Current Password"
            placeholder="Enter current password"
            control={passwordControl}
            size="large"
            type="password"
            icon={<FiLock size={14} className="text-[#b4bcd4]" />}
            rules={{ required: "Current password is required" }}
          />

          <div>
            <CustomInput<ChangePasswordFormValues>
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              control={passwordControl}
              size="large"
              type="password"
              icon={<FiLock size={14} className="text-[#b4bcd4]" />}
              rules={{
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              }}
            />
            {newPassword && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
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

          <CustomInput<ChangePasswordFormValues>
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            control={passwordControl}
            size="large"
            type="password"
            icon={<FiLock size={14} className="text-[#b4bcd4]" />}
            rules={{
              required: "Please confirm your password",
              validate: (value: string) =>
                value === watch("newPassword") || "Passwords do not match",
            }}
          />

          <div className="flex gap-3 pt-3">
            <Button
              block
              size="large"
              onClick={() => {
                setPasswordOpen(false);
                resetPasswordForm();
              }}
            >
              Cancel
            </Button>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={passwordLoading}
            >
              {!passwordLoading && "Update Password"}
            </Button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default ProfilePage;
