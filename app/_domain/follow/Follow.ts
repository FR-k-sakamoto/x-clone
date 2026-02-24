import { FollowFollowerId } from "@/app/_domain/follow/FollowFollowerId";
import { FollowFollowingId } from "@/app/_domain/follow/FollowFollowingId";

export class Follow {
  constructor(
    private readonly followerId: FollowFollowerId,
    private readonly followingId: FollowFollowingId,
    private readonly createdAt: Date
  ) {}

  getFollowerId() {
    return this.followerId;
  }

  getFollowingId() {
    return this.followingId;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
