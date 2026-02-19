import { ProfileName } from "@/app/_domain/user-profile/ProfileName";
import { UserBio } from "@/app/_domain/user-profile/UserBio";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import { UserId } from "@/app/_domain/user-profile/UserId";

export class UserProfile {
  constructor(
    private readonly userId: UserId,
    private readonly handle: UserHandle,
    private readonly name: ProfileName,
    private readonly bio: UserBio
  ) {}

  getUserId() {
    return this.userId;
  }

  getHandle() {
    return this.handle;
  }

  getName() {
    return this.name;
  }

  getBio() {
    return this.bio;
  }
}
