import { LikePostId } from "@/app/_domain/reaction/LikePostId";
import { LikeUserId } from "@/app/_domain/reaction/LikeUserId";

export class Like {
  constructor(
    private readonly userId: LikeUserId,
    private readonly postId: LikePostId,
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
