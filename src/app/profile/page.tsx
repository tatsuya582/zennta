import ProfilePageLayout from "@/components/layout/ProfilePageLayout";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
  <Suspense>
    <ProfilePageLayout title="マイページ" isEdit={false} />;
  </Suspense>
  )
}
