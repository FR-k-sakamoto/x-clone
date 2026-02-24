import { ReplyAuthorId } from "@/app/_domain/reply/ReplyAuthorId";
import { ReplyBody } from "@/app/_domain/reply/ReplyBody";
import { ReplyId } from "@/app/_domain/reply/ReplyId";
import { ReplyParentPostId } from "@/app/_domain/reply/ReplyParentPostId";

export class Reply {
  constructor(
    private readonly id: ReplyId,
    private readonly authorId: ReplyAuthorId,
    private readonly parentPostId: ReplyParentPostId,
    private readonly body: ReplyBody,
    private readonly createdAt: Date
  ) {}

  getId() {
    return this.id;
  }

  getAuthorId() {
    return this.authorId;
  }

  getParentPostId() {
    return this.parentPostId;
  }

  getBody() {
    return this.body;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
