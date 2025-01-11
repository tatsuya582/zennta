import { render, screen } from "@testing-library/react";
import { GroupSearchForm } from "@/components/layout/group/GroupSearchForm";
import { type Dispatch, type SetStateAction } from "react";
import { type groupArticle } from "@/types/types";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

const setArticlesMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<groupArticle[]>>>;
const setNumberMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<number>>>;

const setStringMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<string>>>;

describe("GroupSearchForm Component", () => {
  it("renders component", async () => {
    render(
      <GroupSearchForm
        query=""
        currentPage={1}
        setTotalPage={setNumberMock}
        setArticles={setArticlesMock}
        setQuery={setStringMock}
        clearQuery={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "クリア" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("検索ワードを入力")).toBeInTheDocument();
  });
});
