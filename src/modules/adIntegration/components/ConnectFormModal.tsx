import React from "react";
import { useForm } from "react-hook-form";
import {
  RiAddLine,
  RiCloseLine,
  RiGlobalLine,
  RiMetaLine,
  RiGoogleLine,
  RiLinkM,
  RiFileListLine,
  RiInformationLine,
  RiCheckLine,
} from "react-icons/ri";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { CreateWebhookConfigPayload } from "../../../api/webhook";

interface Props {
  open: boolean;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (data: CreateWebhookConfigPayload) => void;
}

const ConnectFormModal: React.FC<Props> = ({
  open,
  isPending,
  isError,
  errorMessage,
  onClose,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWebhookConfigPayload>({
    defaultValues: { platform: "", formId: "", formName: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal open={open} onClose={handleClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <RiAddLine size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Connect Ad Form
            </h3>
            <p className="text-xs text-slate-500">
              Add a Meta or Google ad form to auto-capture leads.
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <RiCloseLine size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <CustomSelect
          name="platform"
          label="Ad Platform"
          placeholder="Select platform"
          control={control}
          errors={errors}
          rules={{ required: "Please select a platform" }}
          icon={<RiGlobalLine size={14} />}
          options={[
            {
              value: "META",
              label: (
                <span className="flex items-center gap-2">
                  <RiMetaLine size={14} className="text-blue-600" /> Meta Ads
                  (Facebook / Instagram)
                </span>
              ),
            },
            {
              value: "GOOGLE",
              label: (
                <span className="flex items-center gap-2">
                  <RiGoogleLine size={14} className="text-emerald-600" /> Google
                  Ads (Lead Form Extensions)
                </span>
              ),
            },
          ]}
        />

        <CustomInput
          name="formId"
          label="Form ID"
          placeholder="e.g. 123456789012345"
          control={control}
          rules={{
            required: "Form ID is required",
            minLength: { value: 3, message: "At least 3 characters" },
          }}
          icon={<RiLinkM size={14} className="text-slate-400" />}
        />

        <CustomInput
          name="formName"
          label="Form Name"
          placeholder="e.g. UK Student Intake 2026"
          control={control}
          rules={{ required: "Form name is required" }}
          icon={<RiFileListLine size={14} className="text-slate-400" />}
        />

        {/* Help text */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <RiInformationLine
            size={14}
            className="text-amber-500 shrink-0 mt-0.5"
          />
          <p className="text-xs text-amber-700 leading-relaxed">
            You can find the Form ID in your{" "}
            <strong>Meta Ads Manager → Lead Forms</strong> or{" "}
            <strong>Google Ads → Lead Form Extensions</strong>. Only leads from
            active forms will be synced.
          </p>
        </div>

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
            <RiCloseLine size={14} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-600">
              {errorMessage || "Failed to add form. Please try again."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Connecting...
              </>
            ) : (
              <>
                <RiCheckLine size={16} /> Connect Form
              </>
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ConnectFormModal;
