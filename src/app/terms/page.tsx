import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TearmsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Zenntaの利用規約</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">第1条 適用</h2>
        <p className="text-gray-700">
          本規約は、このサービスを利用するすべての方に適用されます。ユーザーは、利用を開始した時点で本規約に同意したものとみなされます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">第2条 禁止行為</h2>
        <p className="text-gray-700 mb-4">次の行為を禁止します。</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>法令や公徳に反する行為</li>
          <li>他人の正当な権利を侵害する行為</li>
          <li>サービスの正常な運営を妨害する行為</li>
          <li>他のユーザーの情報を不正に取得する行為</li>
          <li>他者に迷惑や害をかける行為</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">第3条 責任限界</h2>
        <p className="text-gray-700">
          サービスの利用に関する事故や損害について、過失がない限りで、運営者は一切責任を負いません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">第4条 規約変更</h2>
        <p className="text-gray-700">
          運営者は、予告なしに本規約を変更できるものとします。変更後にサービスを利用した場合、変更後の規約に同意したものとみなされます。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">第5条 法律と対策</h2>
        <p className="text-gray-700">
          本規約に関しては、日本国の法令を適用します。主要な問題は、東京地方裁判所を一の所在地とします。
        </p>
      </section>
    </div>
  );
}
