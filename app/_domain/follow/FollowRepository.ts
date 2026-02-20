import type { FollowFollowerId } from "@/app/_domain/follow/FollowFollowerId";
import type { FollowFollowingId } from "@/app/_domain/follow/FollowFollowingId";

export interface FollowRepository {
  exists(params: {
    followerId: FollowFollowerId;
    followingId: FollowFollowingId;
  }): Promise<boolean>;
  create(params: {
    followerId: FollowFollowerId;
    followingId: FollowFollowingId;
  }): Promise<void>;
  remove(params: {
    followerId: FollowFollowerId;
    followingId: FollowFollowingId;
  }): Promise<void>;
  findFollowedUserIds(params: {
    followerId: FollowFollowerId;
    followingIds: FollowFollowingId[];
  }): Promise<Set<string>>;
}
