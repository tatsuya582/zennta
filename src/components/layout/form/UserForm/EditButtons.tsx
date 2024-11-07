import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditButtons({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex gap-2">
      <div>
        <Link href="/profile">
          <Button type="button" variant="outline">
            戻る
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div>
          <Button type="submit">
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
