"use client";

import { useState, useTransition } from "react";

import { toggleFollowAction } from "@/app/_actions/follow/actions";
import { FollowButton } from "@/app/_components/follow/FollowButton";

export function FollowToggleButton(props: {
  followingId: string;
  initialFollowedByMe: boolean;
  profileHandle?: string;
}) {
  const [followedByMe, setFollowedByMe] = useState(props.initialFollowedByMe);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    const prev = followedByMe;
    const intent = prev ? "unfollow" : "follow";
    setFollowedByMe(!prev);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("followingId", props.followingId);
        formData.set("intent", intent);
        if (props.profileHandle) {
          formData.set("profileHandle", props.profileHandle);
        }
        await toggleFollowAction(formData);
      } catch {
        setFollowedByMe(prev);
      }
    });
  };

  return <FollowButton followedByMe={followedByMe} pending={isPending} onClick={onClick} />;
}
