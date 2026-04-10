import React, { useEffect } from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { FiTrash2, FiEdit2, FiX } from "react-icons/fi";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import type { User } from "../utils/constants";

interface DeleteModalProps {
  user: User | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteUserModal: React.FC<DeleteModalProps> = ({
  user,
  loading,
  onConfirm,
  onClose,
}) => (
  <CustomModal open={!!user} onClose={onClose}>
    <div className="px-6 py-6 text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <FiTrash2 size={22} className="text-red-500" />
      </div>
      <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">
        Remove {user?.name}?
      </h3>
      <p className="text-sm text-slate-400 mb-6 max-w-[280px] leading-relaxed">
        This will permanently remove their account and revoke all access. This
        action cannot be undone.
      </p>
      <div className="flex gap-2.5 w-full">
        <Button block size="large" onClick={onClose}>
          Cancel
        </Button>
        <Button
          block
          size="large"
          danger
          type="primary"
          loading={loading}
          onClick={onConfirm}
        >
          Remove User
        </Button>
      </div>
    </div>
  </CustomModal>
);

interface EditFormValues {
  role: string;
}

interface EditModalProps {
  user: User | null;
  loading: boolean;
  onConfirm: (role: string) => void;
  onClose: () => void;
}

export const EditRoleModal: React.FC<EditModalProps> = ({
  user,
  loading,
  onConfirm,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditFormValues>({ defaultValues: { role: "" } });

  // Reset form whenever a different user is opened
  useEffect(() => {
    reset({ role: user?.role ?? "" });
  }, [user, reset]);

  const currentRole = watch("role");
  const unchanged = currentRole === user?.role;

  return (
    <CustomModal open={!!user} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <FiEdit2 size={17} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 m-0">
              Edit Role
            </h3>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              {user?.name} · {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Body */}
      <form
        onSubmit={handleSubmit((data) => onConfirm(data.role))}
        className="px-6 py-5 flex flex-col gap-5"
      >
        <CustomSelect
          name="role"
          label="Assign Role"
          placeholder="Select a role"
          control={control}
          errors={errors}
          required
          rules={{ required: "Role is required" }}
          options={[
            { value: "ADMIN", label: "Admin" },
            { value: "COUNSELOR", label: "Counselor" },
          ]}
        />

        <div className="flex gap-2.5">
          <Button block size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={unchanged}
          >
            Update Role
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};
