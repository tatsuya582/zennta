import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { Suspense } from "react";
import { getUser } from "@/actions/user";

export const AuthNavigation = async () => {
  const user = await getUser();

  return (
    <>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Suspense fallback={<div>Loading...</div>}>
                {user ? (
                  <div className="flex md:flex-row flex-col">
                    <div>
                      <Link href="/profile" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>マイページ</NavigationMenuLink>
                      </Link>
                    </div>
                    <form action={logout}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <button type="submit">ログアウト</button>
                      </NavigationMenuLink>
                    </form>
                  </div>
                ) : (
                  <>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>ログイン</NavigationMenuLink>
                    </Link>
                    <Link href="/signup" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>会員登録</NavigationMenuLink>
                    </Link>
                  </>
                )}
              </Suspense>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};
