import type {
  ForgotPasswordFormValues,
  ForgotStep,
  ResetPasswordFormValues,
} from "../../../types/auth";
import EmailStep from "./EmailStep";
import ResetStep from "./ResetStep";
import SuccessStep from "./SuccessStep";

interface ForgotPasswordFormProps {
  step: ForgotStep;
  loading: boolean;
  submittedEmail: string;
  onEmailSubmit: (data: ForgotPasswordFormValues) => void;
  onResetSubmit: (data: ResetPasswordFormValues) => void;
  onBack: () => void;
}

const ForgotPasswordForm = ({
  step,
  loading,
  submittedEmail,
  onEmailSubmit,
  onResetSubmit,
  onBack,
}: ForgotPasswordFormProps) => {
  if (step === "reset")
    return (
      <ResetStep
        loading={loading}
        submittedEmail={submittedEmail}
        onSubmit={onResetSubmit}
        onBack={onBack}
      />
    );

  if (step === "success") return <SuccessStep />;

  return <EmailStep loading={loading} onSubmit={onEmailSubmit} />;
};

export default ForgotPasswordForm;
