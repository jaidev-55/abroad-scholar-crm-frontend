import React from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import {
  FiUserPlus,
  FiShield,
  FiUsers,
  FiMail,
  FiLock,
  FiUser,
  FiX,
} from "react-icons/fi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { AddUserFormValues } from "../utils/constants";

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: AddUserFormValues) => void;
}

const AddUserModal: React.FC<Props> = ({
  open,
  loading,
  onClose,
  onSubmit,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    defaultValues: { name: "", email: "", password: "", role: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal open={open} onClose={handleClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <FiUserPlus size={17} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 m-0">
              Add Team Member
            </h3>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Create a new staff account
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-6 py-5 flex flex-col gap-4"
      >
        {/* Info banner */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5">
          <FiShield size={13} className="text-blue-500 shrink-0" />
          <span className="text-xs font-semibold text-blue-700">
            An OTP verification email will be sent to the new member
          </span>
        </div>

        <CustomInput
          name="name"
          label="Full Name"
          placeholder="e.g. Priya Sharma"
          control={control}
          type="text"
          icon={<FiUser size={14} className="text-slate-400" />}
          rules={{
            required: "Name is required",
            minLength: { value: 2, message: "At least 2 characters" },
          }}
        />

        <CustomInput
          name="email"
          label="Staff Email"
          placeholder="member@abroadscholar.com"
          control={control}
          type="email"
          icon={<FiMail size={14} className="text-slate-400" />}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Valid email required",
            },
          }}
        />

        <CustomInput
          name="password"
          label="Temporary Password"
          placeholder="Create a temporary password"
          control={control}
          type="password"
          icon={<FiLock size={14} className="text-slate-400" />}
          rules={{
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          }}
        />

        <CustomSelect
          name="role"
          label="Assign Role"
          placeholder="Select a role"
          control={control}
          errors={errors}
          required
          rules={{ required: "Role is required" }}
          options={[
            {
              value: "ADMIN",
              label: (
                <span className="flex items-center gap-2">
                  <FiShield size={13} className="text-violet-500" /> Admin
                </span>
              ),
            },
            {
              value: "COUNSELOR",
              label: (
                <span className="flex items-center gap-2">
                  <FiUsers size={13} className="text-sky-500" /> Counselor
                </span>
              ),
            },
          ]}
        />

        {/* Footer */}
        <div className="flex gap-2.5 pt-1">
          <Button block size="large" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {!loading && (
              <span className="flex items-center justify-center gap-2">
                <FiUserPlus size={14} /> Add Member
              </span>
            )}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddUserModal;
