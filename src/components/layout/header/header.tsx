import AuthNavigation from "@/components/layout/header/AuthNavigation";
import MainNavigation from "@/components/layout/header/MainNavigation";
import MobileNavigation from "@/components/layout/header/MobileNavigation";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="w-full border-b border-gray-300">
        <div className="flex justify-between max-w-screen-lg my-3 mx-auto md:w-11/12 w-9/12">
          <Link href="/" className="flex items-center">
            <h1 className="font-bold md:text-6xl text-2xl text-sky-500 inline-block">Zennta</h1>
          </Link>
          <div className="md:hidden block">
            <MobileNavigation />
          </div>
          <div className="flex-col hidden md:flex">
            <div className="ml-auto">
              <AuthNavigation />
            </div>
            <MainNavigation />
          </div>
        </div>
      </div>
    </>
  );
}
