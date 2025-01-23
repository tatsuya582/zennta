import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";

export const LinkButtonWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-end gap-2 md:mt-0 mt-4" data-testid="link-button">
      <div>
        <NavigationMenu>
          <NavigationMenuList>{children}</NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
