import { getCreateGroupArticles } from "@/actions/group";
import { CreateGroupPresentation } from "@/components/layout/group/CreateGroupPresentation";
import { NotArticleError } from "@/components/layout/main/NotArticleError";

export const CreateGroup = async () => {
  const fetchResult = await getCreateGroupArticles(1, undefined);
  const articles = fetchResult?.articles;

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
        <NotArticleError />
      </div>
    );
  }

  return <CreateGroupPresentation initArticles={articles} initTotalPage={fetchResult.totalPage} />;
};
