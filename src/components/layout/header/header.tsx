import AuthNavigation from "@/components/layout/header/AuthNavigation";
import MainNavigation from "@/components/layout/header/MainNavigation";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="w-full border-b border-gray-300">
        <div className="flex justify-between max-w-screen-lg my-3 mx-auto w-11/12">
          <Link href="/" className="flex items-center">
            <h1 className="font-bold text-6xl text-sky-500 inline-block">Zennta</h1>
          </Link>
          <div className="flex-col hidden md:flex">
            <AuthNavigation />
            <MainNavigation />
          </div>
        </div>
      </div>
    </>
  );
}
