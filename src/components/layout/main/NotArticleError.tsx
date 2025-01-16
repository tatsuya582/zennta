export const NotArticleError = ({ isGroup = false }: { isGroup?: boolean }) => {
  return (
    <div className="flex items-center justify-center h-screen">{isGroup ? "公開中のグループ" : "記事"}がありません</div>
  );
};
