import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function MainNavigation() {
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
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>お気に入り</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}
