import TearmsPage, { metadata } from "@/app/terms/page";
import { render, screen } from "@testing-library/react";

describe("TearmsPage", () => {
  it("should render the page with correct components", () => {
    render(<TearmsPage />);

    expect(screen.getByText("Zenntaの利用規約")).toBeInTheDocument();
    expect(screen.getByText("第1条 適用")).toBeInTheDocument();
    expect(screen.getByText("第2条 禁止行為")).toBeInTheDocument();
    expect(screen.getByText("第3条 責任限界")).toBeInTheDocument();
    expect(screen.getByText("第4条 規約変更")).toBeInTheDocument();
    expect(screen.getByText("第5条 法律と対策")).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("利用規約");
  });
});
