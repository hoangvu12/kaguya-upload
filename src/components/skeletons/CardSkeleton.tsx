import React from "react";
import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";

const CardSkeleton = () => {
  return (
    <Skeleton>
      <SkeletonItem className="aspect-w-2 aspect-h-3"></SkeletonItem>
    </Skeleton>
  );
};

export default CardSkeleton;
