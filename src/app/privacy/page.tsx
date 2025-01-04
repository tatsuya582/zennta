import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Zenntaのプライバシーポリシー</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">第1条 個人情報の収集</h3>
        <p className="text-gray-700 mb-4">我々は、ユーザーから次の情報を収集する場合があります。</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>ユーザーが自発的に提供する情報</li>
          <li>サービス利用により自動的に収集される情報</li>
          <li>その他合理的方法で収集される情報</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">第2条 個人情報の使用目的</h3>
        <p className="text-gray-700 mb-4">収集した個人情報は、次の目的で利用されます。</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>サービスの提供や運営</li>
          <li>問い合わせの対応</li>
          <li>サービス改善のための分析と研究</li>
          <li>法令上の義務を完遂するため</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">第3条 個人情報の共有と揭示</h3>
        <p className="text-gray-700 mb-4">我々は、個人情報を次の場合を除き、他者と共有しません。</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>ユーザーの同意がある場合</li>
          <li>法令に基づき共有が必要な場合</li>
          <li>会社合併などの事情による情報移転</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">第4条 個人情報の保守</h3>
        <p className="text-gray-700">
          我々は、収集した個人情報の正確性や安全性を確保するために、監訳・設備・プロセスを適切に組み込みます。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">第5条 個人情報の開示、修正、削除</h3>
        <p className="text-gray-700">
          ユーザーが自身の個人情報の開示、修正、削除を希望する場合、異議なき場合に限り、実施します。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">第6条 問い合わせ先</h3>
        <p className="text-gray-700">
          個人情報の収集、使用、保存に関して問題がある場合は、次の連絡先までお問い合わせください。
        </p>
        <p className="text-gray-700">[ 連絡先情報 ]</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">第7条 改定</h3>
        <p className="text-gray-700">
          本ポリシーは予告なしに変更されることがあります。変更後にサイトを利用することにより、変更後のポリシーに同意したものとみなされます。
        </p>
      </section>
    </div>
  );
}
