import { getUser } from "@/actions/user";
import UserForm from "@/components/layout/form/UserForm/UserForm";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfileEditPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col gap-6 items-center md:w-2/3 max-w-lg w-full md:p-12 p-6 md:mt-2 mt-6 md:border rounded-lg border-gray-300">
          <h2 className="text-center">マイページ編集</h2>
          <div className="flex flex-col gap-6">
            <Image
              src={user?.avatarUrl ? user?.avatarUrl : "/no_image.jpg"}
              alt="user image"
              width={500}
              height={500}
              className="rounded-full p-4"
            />
          </div>
          <div className="w-11/12 max-w-lg px-8 py-4 md:mt-2 mt-6 border rounded-lg border-gray-300">
            <UserForm name={user.name} edit={true} />
          </div>
        </div>
      </div>
    </>
  );
}
