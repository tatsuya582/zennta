import { render, screen } from "@testing-library/react";
import { GroupPagiNation } from "@/components/layout/group/GroupPagiNation";
import { type Dispatch, type SetStateAction } from "react";
import { type groupArticle } from "@/types/types";

const mockTotalPage = 1;
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

const setArticlesMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<groupArticle[]>>>;
const setNumberMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<number>>>;

const setBooleanMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<boolean>>>;

describe("GroupPagiNation Component", () => {
  it("renders component", async () => {
    render(
      <GroupPagiNation
        currentPage={1}
        totalPage={mockTotalPage}
        query=""
        isLoadingNext={false}
        isLoadingPrev={false}
        setArticles={setArticlesMock}
        setCurrentPage={setNumberMock}
        setIsLoadingNext={setBooleanMock}
        setIsLoadingPrev={setBooleanMock}
      />
    );

    expect(screen.getByText("1ページ")).toBeInTheDocument();
  });

  it("renders the last page with previous page button", async () => {
    render(
      <GroupPagiNation
        currentPage={2}
        totalPage={2}
        query=""
        isLoadingNext={false}
        isLoadingPrev={false}
        setArticles={setArticlesMock}
        setCurrentPage={setNumberMock}
        setIsLoadingNext={setBooleanMock}
        setIsLoadingPrev={setBooleanMock}
      />
    );

    expect(screen.getByText("前のページ")).toBeInTheDocument();
    expect(screen.getByText("2ページ")).toBeInTheDocument();
  });

  it("renders the first page with next page button", async () => {
    render(
      <GroupPagiNation
        currentPage={1}
        totalPage={2}
        query=""
        isLoadingNext={false}
        isLoadingPrev={false}
        setArticles={setArticlesMock}
        setCurrentPage={setNumberMock}
        setIsLoadingNext={setBooleanMock}
        setIsLoadingPrev={setBooleanMock}
      />
    );

    expect(screen.getByText("1ページ")).toBeInTheDocument();
    expect(screen.getByText("次のページ")).toBeInTheDocument();
  });
});
