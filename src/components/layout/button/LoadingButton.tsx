import { Button } from "@/components/ui/button";
import { MouseEventHandler, ReactNode } from "react";

export default function LoadingButton({
  isLoading,
  loadingMx,
  children,
  variant = "default",
  onSubmit = null,
}: {
  isLoading: boolean;
  loadingMx: string;
  children: ReactNode;
  variant?: "default" | "outline" | "readLater" | "favorite";
  onSubmit?: (MouseEventHandler<HTMLButtonElement> | undefined) | null;
}) {
  return (
    <div className="w-full">
      {isLoading ? (
        <Button variant={variant} className="w-full" aria-label="loading" disabled>
          <span className={`loader-outline-button ${loadingMx}`}></span>
        </Button>
      ) : onSubmit ? (
        <Button onClick={onSubmit} variant={variant} className="w-full" aria-label="delete">
          {children}
        </Button>
      ) : (
        <Button type="submit" variant={variant} className="w-full" aria-label="delete">
          {children}
        </Button>
      )}
    </div>
  );
}
