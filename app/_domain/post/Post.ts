import { PostAuthorId } from "@/app/_domain/post/PostAuthorId";
import { PostBody } from "@/app/_domain/post/PostBody";
import { PostId } from "@/app/_domain/post/PostId";

export class Post {
  constructor(
    private readonly id: PostId,
    private readonly authorId: PostAuthorId,
    private body: PostBody,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  getId() {
    return this.id;
  }

  getAuthorId() {
    return this.authorId;
  }

  getBody() {
    return this.body;
  }

  editBody(nextBody: PostBody, editorId: PostAuthorId) {
    if (!this.authorId.equals(editorId)) {
      throw new Error("Only author can edit the post.");
    }

    this.body = nextBody;
    this.updatedAt = new Date();
  }

  canBeDeletedBy(userId: PostAuthorId) {
    return this.authorId.equals(userId);
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}
