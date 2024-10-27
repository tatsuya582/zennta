import { Button } from "@/components/ui/button";

export default function Signup() {
  return (
    <div className="flex justify-center mt-12">
      <div className="flex flex-col gap-6 items-center md:w-1/2 w-full p-12 md:mt-2 mt-6 border rounded-lg border-gray-300">
        <h2 className="text-center">会員登録</h2>
        <div className="flex flex-col gap-6">
          <Button size="lg">GitHubで会員登録</Button>
          <Button>Googleで会員登録</Button>
          <Button>Xで会員登録</Button>
        </div>
      </div>
    </div>
  );
}
