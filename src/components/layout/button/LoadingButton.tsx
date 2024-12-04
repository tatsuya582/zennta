import { Button } from "@/components/ui/button";
import { MouseEventHandler, ReactNode } from "react";

export default function LoadingButton({
  isLoading,
  variant,
  loadingMx,
  children,
  onSubmit = null,
}: {
  isLoading: boolean;
  variant: "default" | "outline";
  loadingMx: string;
  children: ReactNode;
  onSubmit?: (MouseEventHandler<HTMLButtonElement> | undefined) | null;
}) {
  return (
    <div>
      {isLoading ? (
        <Button variant={variant} className="w-full" disabled>
          <span className={`loader-outline-button ${loadingMx}`}></span>
        </Button>
      ) : onSubmit ? (
        <Button onClick={onSubmit} variant={variant} className="w-full">
          {children}
        </Button>
      ) : (
        <Button type="submit" variant={variant} className="w-full">
          {children}
        </Button>
      )}
    </div>
  );
}
