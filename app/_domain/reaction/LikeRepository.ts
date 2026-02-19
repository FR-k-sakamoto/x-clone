import { LikePostId } from "@/app/_domain/reaction/LikePostId";
import { LikeUserId } from "@/app/_domain/reaction/LikeUserId";

export interface LikeRepository {
  exists(params: { userId: LikeUserId; postId: LikePostId }): Promise<boolean>;
  create(params: { userId: LikeUserId; postId: LikePostId }): Promise<void>;
  remove(params: { userId: LikeUserId; postId: LikePostId }): Promise<void>;
  countByPostIds(postIds: LikePostId[]): Promise<Map<string, number>>;
  findLikedPostIds(params: {
    userId: LikeUserId;
    postIds: LikePostId[];
  }): Promise<Set<string>>;
}
