import { SigninButton } from "@/components/ui/signinButton";

export default function LoginPage() {
  return (
    <div className="flex justify-center mt-12">
      <div className="flex flex-col gap-6 items-center md:w-2/3 max-w-lg w-full p-12 md:mt-2 mt-6 border rounded-lg border-gray-300">
        <h2 className="text-center">ログイン</h2>
        <div className="flex flex-col gap-6">
          <SigninButton provider="github">GitHubでログイン</SigninButton>
          <SigninButton provider="google">Googleでログイン</SigninButton>
          <SigninButton provider="twitter">Xでログイン</SigninButton>
        </div>
      </div>
    </div>
  );
}
