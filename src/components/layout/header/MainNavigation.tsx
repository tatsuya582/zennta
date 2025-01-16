import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export const MainNavigation = () => {
  return (
    <>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/search" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>検索</NavigationMenuLink>
              </Link>
              <Link href="/readlater" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>後で読む</NavigationMenuLink>
              </Link>
              <Link href="/favorite" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>お気に入り</NavigationMenuLink>
              </Link>
              <Link href="/group" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>お気に入りグループ</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};
