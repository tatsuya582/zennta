import PrivacyPage, { metadata } from "@/app/privacy/page";
import { render, screen } from "@testing-library/react";

describe("PrivacyPage", () => {
  it("should render the page with correct components", () => {
    render(<PrivacyPage />);

    expect(screen.getByText("Zenntaのプライバシーポリシー")).toBeInTheDocument();
    expect(screen.getByText("第1条 個人情報の収集")).toBeInTheDocument();
    expect(screen.getByText("第2条 個人情報の使用目的")).toBeInTheDocument();
    expect(screen.getByText("第3条 個人情報の共有と揭示")).toBeInTheDocument();
    expect(screen.getByText("第4条 個人情報の保守")).toBeInTheDocument();
    expect(screen.getByText("第5条 個人情報の開示、修正、削除")).toBeInTheDocument();
    expect(screen.getByText("第6条 問い合わせ先")).toBeInTheDocument();
    expect(screen.getByText("第7条 改定")).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("プライバシーポリシー");
  });
});
