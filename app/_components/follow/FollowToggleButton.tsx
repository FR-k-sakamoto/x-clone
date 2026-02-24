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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    const prev = followedByMe;
    const intent = prev ? "unfollow" : "follow";
    setFollowedByMe(!prev);
    setErrorMessage(null);

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
        setErrorMessage("フォロー状態の更新に失敗しました。");
      }
    });
  };

  return (
    <div className="space-y-1">
      <FollowButton followedByMe={followedByMe} pending={isPending} onClick={onClick} />
      {errorMessage ? (
        <p className="text-right text-xs text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
