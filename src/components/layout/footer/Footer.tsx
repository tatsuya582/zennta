import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="w-full md:py-4 py-2 border-t border-gray-100" data-testid="footer">
      <NavigationMenu>
        <NavigationMenuList className="text-center">
          <NavigationMenuItem className="flex md:flex-row flex-col justify-center">
            <NavigationMenuLink
              href={process.env.NEXT_PUBLIC_FORM_URL!}
              target="_blank"
              rel="noopener noreferrer"
              className={navigationMenuTriggerStyle()}
            >
              お問い合わせフォーム
            </NavigationMenuLink>
            <Link href="/terms" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>利用規約</NavigationMenuLink>
            </Link>
            <Link href="/privacy" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>プライバシーポリシー</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
