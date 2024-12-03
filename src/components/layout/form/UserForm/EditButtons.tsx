import { Button } from "@/components/ui/button";

export default function EditButtons({ isLoading }: { isLoading: boolean }) {
  return (
    <div>
      {isLoading ? (
        <div>
          <Button type="submit" disabled>
            <span className="loader mx-1"></span>
          </Button>
        </div>
      ) : (
        <div>
          <Button type="submit">編集</Button>
        </div>
      )}
    </div>
  );
}
