# サービス概要
ZennやQiitaのAPIを利用して記事一覧や検索を同時にできるサービスです
読んだ履歴や後で読む、お気に入りなどができます。

## このサービスへの思い・作りたい理由
ポートフォリオを作っても自分で使わなければもったいないなと思い、
エンジニアになった後でも利用したいものを作りたいと思いました。

サービスが終了した後でも自分でローカルで使おうと思えるようなサービスにしたいと考えています。

## ユーザー層について
- 現役のエンジニアや勉強中の人

## サービスの利用イメージ
- 記事の一覧をZennとQiitaを同じページでできるのでサイト巡回が効率化できます。
- 検索も同時にできるので効率が上がります。（Stack Overflowも追加を検討中です）
- 後で読む、お気に入り機能で後から読み直したり記事に自分用のメモをつけて後から探しやすくします。

## ユーザーの獲得について
- SNS（主にX）を用いた宣伝
- 未ログイン時でも一覧表示や検索機能は使えるようにしてイメージを掴みやすくする。

## サービスの差別化ポイント・推しポイント
- グーグル検索などでジャマな広告がいっぱいついた変なサイトにイラついたりすることがなくなります。

## 機能候補
#### MVPリリース
- 一覧表示機能
- 検索機能
- 後で読む、お気に入り機能
- お気に入り記事に自分用のメモをつける機能
- 閲覧履歴表示

#### 本リリース
- お気に入り記事をグループ化できる機能
- 他人のお気に入り記事のグループを閲覧したり自分のお気に入り記事のグループを公開したりする機能
- 一覧表示に「ここまで読んだ」を表示
- uiのカスタマイズ機能

## 機能の実装方針予定
- 一覧表示や検索機能はqiitaとzennのAPIを利用
- 閲覧履歴は表示したリンクのonclinkイベントを使ってデータベースに保存する予定。ブラウザの履歴とかは触らない予定
- お気に入り記事をグループ化とuiのカスタマイズ機能はドラッグアンドドロップでできるようにしたい。ライブラリは未選定

## 使用技術一覧
| カテゴリ        | 技術                                           |
|-----------------|------------------------------------------------|
| フロントエンド  | Next.js/TailwindCSS/DaisyUI                    |
| バックエンド    | Prisma/Supabase                                |
| データベース    | PostgreSQL（Supabase内で管理）                 |
| 環境構築        | Docker                                         |
| インフラ        | vercel                                         |