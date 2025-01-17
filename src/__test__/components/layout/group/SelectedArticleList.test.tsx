import { render, screen } from "@testing-library/react";
import { GroupPagiNation } from "@/components/layout/group/GroupPagiNation";
import { SelectedArticleList } from "@/components/layout/group/SelectedArticleList";
import { CreateGroupForm } from "@/components/layout/form/CreateGroupForm";
import { type Dispatch, type SetStateAction } from "react";
import { type groupArticle } from "@/types/types";

jest.mock("@/components/layout/form/CreateGroupForm", () => ({
  CreateGroupForm: jest.fn(() => <div data-testid="CreateGroupForm" />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

const mockArticles = [
  {
    favoriteId: "1",
    title: "test-title1",
  },
  {
    favoriteId: "2",
    title: "test-title2",
  },
];

const mockGroup = {
  createdAt: "2024-01-01",
  id: "1",
  isPublished: true,
  title: "test title",
  updatedAt: "2024-01-01",
  userId: "1",
  userName: "test name",
};

const mockTotalPage = 1;
const setArticlesMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<groupArticle[]>>>;

describe("NotSelectedArticleList Component", () => {
  it("renders component when create Page and articles null", async () => {
    render(
      <SelectedArticleList selectedArticles={[]} setArticles={setArticlesMock} setSelectedArticles={setArticlesMock} />
    );

    expect(screen.getByText("選択中の記事")).toBeInTheDocument();
    expect(screen.getByText("記事が選択されていません")).toBeInTheDocument();

    expect(screen.getByTestId("CreateGroupForm")).toBeInTheDocument();
    expect(screen.getByTestId("selected-articles")).toBeInTheDocument();
  });

  it("renders component when create Page", async () => {
    render(
      <SelectedArticleList
        selectedArticles={mockArticles}
        setArticles={setArticlesMock}
        setSelectedArticles={setArticlesMock}
      />
    );

    expect(screen.getByText("選択中の記事")).toBeInTheDocument();

    expect(screen.getByText("test-title1")).toBeInTheDocument();
    expect(screen.getByText("test-title2")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "削除" })).toHaveLength(2);
  });

  it("passes correct props to CreateGroupForm component when create Page", async () => {
    render(
      <SelectedArticleList selectedArticles={[]} setArticles={setArticlesMock} setSelectedArticles={setArticlesMock} />
    );

    expect(CreateGroupForm).toHaveBeenCalled();
    const firstCallArgs = (CreateGroupForm as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.selectedArticles).toEqual([]);
    expect(firstCallArgs.initArticles).toEqual([]);
    expect(firstCallArgs.group).toBe(undefined);
  });

  it("renders component when edit Page", async () => {
    render(
      <SelectedArticleList
        selectedArticles={mockArticles}
        setArticles={setArticlesMock}
        setSelectedArticles={setArticlesMock}
        setDeleteArticles={setArticlesMock}
        initArticles={mockArticles}
        group={mockGroup}
      />
    );

    expect(CreateGroupForm).toHaveBeenCalled();
    const firstCallArgs = (CreateGroupForm as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.selectedArticles).toEqual(mockArticles);
    expect(firstCallArgs.initArticles).toEqual(mockArticles);
    expect(firstCallArgs.group).toBe(mockGroup);
  });

  it("renders component when delete Page", async () => {
    render(
      <SelectedArticleList
        selectedArticles={mockArticles}
        setArticles={setArticlesMock}
        setSelectedArticles={setArticlesMock}
        isDelete
      />
    );

    expect(screen.getByText("削除選択中の記事")).toBeInTheDocument();

    expect(screen.getByTestId("deleted-artciles")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "選択" })).toHaveLength(2);
  });
});
