import React from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiX } from "react-icons/fi";
import { RiLoader4Line } from "react-icons/ri";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import { getStrength } from "../utils/helpers";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordFormValues) => void;
}

const ChangePasswordModal: React.FC<Props> = ({
  open,
  loading,
  onClose,
  onSubmit,
}) => {
  const { handleSubmit, control, reset, watch } =
    useForm<ChangePasswordFormValues>({
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const newPassword = watch("newPassword", "");
  const strength = getStrength(newPassword);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal open={open} onClose={handleClose}>
      {/* Header */}
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
          onClick={handleClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer border-none bg-transparent transition-colors"
        >
          <FiX size={15} className="text-slate-400" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-6 py-5 flex flex-col gap-4"
      >
        <CustomInput
          name="currentPassword"
          label="Current Password"
          placeholder="Enter current password"
          control={control}
          type="password"
          icon={<FiLock size={13} className="text-slate-300" />}
          rules={{ required: "Current password is required" }}
        />

        <div>
          <CustomInput
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            control={control}
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
          control={control}
          type="password"
          icon={<FiLock size={13} className="text-slate-300" />}
          rules={{
            required: "Please confirm your password",
            validate: (v: string) =>
              // eslint-disable-next-line react-hooks/incompatible-library
              v === watch("newPassword") || "Passwords do not match",
          }}
        />

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-bold border-none cursor-pointer hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
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
  );
};

export default ChangePasswordModal;
