export type ReplyThreadNode = {
  postId: string;
  parentId: string | null;
  authorId: string;
  authorHandle: string;
  body: string;
  createdAtIso: string;
  depth: number;
};
