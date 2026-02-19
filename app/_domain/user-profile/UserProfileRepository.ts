import { ProfileName } from "@/app/_domain/user-profile/ProfileName";
import { UserBio } from "@/app/_domain/user-profile/UserBio";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import { UserId } from "@/app/_domain/user-profile/UserId";
import { UserProfile } from "@/app/_domain/user-profile/UserProfile";

export interface UserProfileRepository {
  findById(userId: UserId): Promise<UserProfile | null>;
  existsByHandle(handle: UserHandle, excludeUserId?: UserId): Promise<boolean>;
  update(params: {
    userId: UserId;
    name: ProfileName;
    handle: UserHandle;
    bio: UserBio;
  }): Promise<void>;
}
