import { Footer } from "@/components/layout/footer/Footer";
import { AuthNavigation } from "@/components/layout/header/AuthNavigation";
import { MainNavigation } from "@/components/layout/header/MainNavigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const MobileNavigation = () => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex flex-col w-72 gap-3 p-4">
                <MainNavigation />
                <AuthNavigation />
                <Footer />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
