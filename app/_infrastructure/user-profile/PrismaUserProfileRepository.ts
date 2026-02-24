import type { PrismaClient } from "@prisma/client";

import { ProfileName } from "@/app/_domain/user-profile/ProfileName";
import { UserBio } from "@/app/_domain/user-profile/UserBio";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import { UserId } from "@/app/_domain/user-profile/UserId";
import { UserProfile } from "@/app/_domain/user-profile/UserProfile";
import type { UserProfileRepository } from "@/app/_domain/user-profile/UserProfileRepository";

export class PrismaUserProfileRepository implements UserProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(userId: UserId): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId.toString() },
      select: {
        id: true,
        name: true,
        handle: true,
        bio: true,
      },
    });

    if (!user) return null;

    return new UserProfile(
      UserId.fromString(user.id),
      UserHandle.fromString(user.handle),
      ProfileName.fromString(user.name),
      UserBio.fromString(user.bio ?? "")
    );
  }

  async findByHandle(handle: UserHandle): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { handle: handle.toString() },
      select: {
        id: true,
        name: true,
        handle: true,
        bio: true,
      },
    });

    if (!user) return null;

    return new UserProfile(
      UserId.fromString(user.id),
      UserHandle.fromString(user.handle),
      ProfileName.fromString(user.name),
      UserBio.fromString(user.bio ?? "")
    );
  }

  async existsByHandle(handle: UserHandle, excludeUserId?: UserId): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { handle: handle.toString() },
      select: { id: true },
    });

    if (!user) return false;
    if (excludeUserId && user.id === excludeUserId.toString()) return false;
    return true;
  }

  async update(params: {
    userId: UserId;
    name: ProfileName;
    handle: UserHandle;
    bio: UserBio;
  }): Promise<void> {
    await this.prisma.user.update({
      where: { id: params.userId.toString() },
      data: {
        name: params.name.toString(),
        handle: params.handle.toString(),
        bio: params.bio.toString(),
      },
    });
  }
}
