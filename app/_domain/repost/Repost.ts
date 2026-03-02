import { RepostPostId } from "@/app/_domain/repost/RepostPostId";
import { RepostUserId } from "@/app/_domain/repost/RepostUserId";

export class Repost {
  constructor(
    private readonly userId: RepostUserId,
    private readonly postId: RepostPostId,
    private readonly createdAt: Date
  ) {}

  getUserId() {
    return this.userId;
  }

  getPostId() {
    return this.postId;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
