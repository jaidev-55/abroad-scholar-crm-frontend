import React, { useState } from "react";
import { Skeleton, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser, updateUser, changePassword } from "../../../api/auth";

import ProfileHeroCard from "../components/ProfileHeroCard";
import ProfileInfoGrid from "../components/ProfileInfoGrid";
import ProfileDetailsCard from "../components/ProfileDetailsCard";
import ProfileSecurityCard from "../components/ProfileSecurityCard";
import EditProfileModal, {
  type EditProfileFormValues,
} from "../components/EditProfileModal";
import ChangePasswordModal, {
  type ChangePasswordFormValues,
} from "../components/ChangePasswordModal";

const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  //  Fetch
  const { data: profile, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  //  Edit profile
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

  //  Change password
  const { mutate: savePassword, isPending: passwordLoading } = useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      message.success("Password changed successfully!");
      setPasswordOpen(false);
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } } };
      message.error(e?.response?.data?.message || "Failed to change password.");
    },
  });

  if (isLoading) {
    return (
      <div className="px-6 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
          <Skeleton avatar active paragraph={{ rows: 3 }} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-5"
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  const displayName = profile?.name || profile?.email?.split("@")[0] || "User";

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none">
          My Profile
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          View and manage your account information
        </p>
      </div>

      <ProfileHeroCard
        displayName={displayName}
        email={profile?.email ?? ""}
        role={profile?.role ?? ""}
        onEdit={() => setEditOpen(true)}
      />

      <ProfileInfoGrid role={profile?.role ?? ""} userId={profile?.id ?? ""} />

      <ProfileDetailsCard
        displayName={displayName}
        email={profile?.email ?? ""}
        role={profile?.role ?? ""}
        onEdit={() => setEditOpen(true)}
      />

      <ProfileSecurityCard onChangePassword={() => setPasswordOpen(true)} />

      {/* Modals */}
      <EditProfileModal
        open={editOpen}
        loading={editLoading}
        defaultValues={{ name: displayName, email: profile?.email ?? "" }}
        onClose={() => setEditOpen(false)}
        onSubmit={saveProfile}
      />

      <ChangePasswordModal
        open={passwordOpen}
        loading={passwordLoading}
        onClose={() => setPasswordOpen(false)}
        onSubmit={savePassword}
      />
    </div>
  );
};

export default ProfilePage;
