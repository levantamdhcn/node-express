export default interface ArticleState extends Document {
  title: string;
  desc: string;
  content: string;
  tagList: Array<string>;
  articleId: string;
  userId: string;
  createdAt: string;
  comments: Comments;
  favoritesCount: number;
  favorited: boolean;
}

export interface CommentState {
  author: {
    image: string;
    username: string;
  };
  body: string;
  createdAt: string;
  id: string;
  updatedAt?: string;
}

export interface Comments extends Array<CommentState> {}
