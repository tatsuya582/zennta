import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/actions/auth";

export default async function AuthNavigation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              {user ? (
                <form action={logout}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <button type="submit">ログアウト</button>
                  </NavigationMenuLink>
                </form>
              ) : (
                <>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>ログイン</NavigationMenuLink>
                  </Link>
                  <Link href="/signup" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>会員登録</NavigationMenuLink>
                  </Link>
                </>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}
