"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateScore } from "@/utils/score";
import { Prisma } from "@prisma/client";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";

interface UserPublicReviewTableProps {
  reviews: Prisma.ReviewGetPayload<{
    include: { author: true; keyboardSwitch: true };
  }>[];
}

export const UserPublicReviewTable = ({
  reviews,
}: UserPublicReviewTableProps) => {
  return (
    <Table className="mt-2 w-full">
      <TableHeader>
        <TableRow className="p-0 m-0">
          <TableHead></TableHead>
          <TableHead className="text-center">Score</TableHead>
          <TableHead className="">Title</TableHead>
          <TableHead className="text-right">Switch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No reviews yet
            </TableCell>
          </TableRow>
        )}
        {reviews.map((review) => {
          return (
            <TableRow key={review.id}>
              <TableCell>
                <Link
                  key={review.id}
                  href={`/switches/${review.keyboardSwitchId}/reviews/${review.author?.handle}`}
                >
                  <SquareArrowOutUpRightIcon size="16" strokeWidth={2} />
                </Link>
              </TableCell>
              <TableCell className="font-bold text-xl text-center">
                {generateScore(review.ratings)}
              </TableCell>
              <TableCell className="truncate ">{review.title ?? "—"}</TableCell>
              <TableCell className="w-full max-w-[200px] truncate text-right">
                <Link href={`/switches/${review.keyboardSwitchId}`}>
                  {review.keyboardSwitch?.name}
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Reviews</TableCell>
          <TableCell className="text-right">{reviews.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
