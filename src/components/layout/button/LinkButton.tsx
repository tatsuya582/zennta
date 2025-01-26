import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";

export const LinkButton = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink className={`${navigationMenuTriggerStyle()} border`}>{children}</NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};
