import React from "react";
import { useForm } from "react-hook-form";
import { FiEdit2, FiX, FiUser, FiMail } from "react-icons/fi";
import { RiLoader4Line } from "react-icons/ri";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";

export interface EditProfileFormValues {
  name: string;
  email: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  defaultValues: EditProfileFormValues;
  onClose: () => void;
  onSubmit: (data: EditProfileFormValues) => void;
}

const EditProfileModal: React.FC<Props> = ({
  open,
  loading,
  defaultValues,
  onClose,
  onSubmit,
}) => {
  const { handleSubmit, control, reset } = useForm<EditProfileFormValues>({
    defaultValues,
  });

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // Sync defaults when opened with new values
  React.useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  return (
    <CustomModal open={open} onClose={handleClose}>
      {/* Header */}
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
          name="name"
          label="Full Name"
          placeholder="Your full name"
          control={control}
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
          control={control}
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
                <RiLoader4Line size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default EditProfileModal;
