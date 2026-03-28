import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import type { LoginFormValues } from "../../components/auth/LoginForm";
import LoginForm from "../../components/auth/LoginForm";
import LoginRightPanel from "../../components/auth/Loginrightpanel";
import { loginUser } from "../../api/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({ mutationFn: loginUser });

  const onLogin = (data: LoginFormValues) => {
    mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          if (res.access_token)
            localStorage.setItem("access_token", res.access_token);
          if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
          message.success("Welcome back!");
          navigate("/admin/dashboard");
        },
        onError: (err) => {
          message.error(err?.message || "Invalid email or password");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT FORM PANEL */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-5 py-12 border-r border-gray-100">
        <div className="w-full max-w-[420px] mx-auto">
          <LoginForm loading={isPending} onSubmit={onLogin} />

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-[#f0f3fa]">
            <p className="text-center text-[11px] text-gray-500">
              © {new Date().getFullYear()} AbroadScholar Internal Portal —
              Confidential • Developed by Jai
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT PANEL */}
      <LoginRightPanel />
    </div>
  );
};

export default LoginPage;
