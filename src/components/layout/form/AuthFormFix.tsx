import { AuthButton } from "@/components/layout/button/AuthButton";

export const AuthForm = ({ type }: { type: string }) => {
  const isLogin = type === "login";
  const title = isLogin ? "ログイン" : "会員登録";
  const buttonText = isLogin ? "でログイン" : "で会員登録";

  return (
    <div className="flex justify-center mt-12">
      <div className="flex flex-col gap-6 items-center md:w-2/3 max-w-lg w-full p-12 md:mt-2 mt-6 border rounded-lg border-gray-300">
        <h2 className="text-center">{title}</h2>
        <div className="flex flex-col gap-6">
          <AuthButton provider="github">GitHub{buttonText}</AuthButton>
          <AuthButton provider="google">Google{buttonText}</AuthButton>
          <AuthButton provider="twitter">X{buttonText}</AuthButton>
        </div>
      </div>
    </div>
  );
};
