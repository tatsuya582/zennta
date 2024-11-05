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
import { currentUser } from "@/lib/auth/currentUser/server";

export default async function AuthNavigation() {
  const user = await currentUser();

  return (
    <>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Suspense fallback={<div>Loading...</div>}>
                {user ? (
                  <form action={logout}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <button type="submit">ログアウト</button>
                    </NavigationMenuLink>
                  </form>
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
}
