import ProfilePageLayout from "@/components/layout/ProfilePageLayout";
import { Suspense } from "react";

export default function ProfileEditPage() {
  return (
    <Suspense>
      <ProfilePageLayout title="マイページ編集" isEdit={true} />;
    </Suspense>
  )
}
