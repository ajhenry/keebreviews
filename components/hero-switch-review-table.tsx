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
import { Avatar, AvatarFallback } from "./ui/avatar";
import PrettyAvatar from "prettyavatars";

interface HeroSwitchReviewTableProps {
  reviews: Prisma.ReviewGetPayload<{
    include: { author: true; keyboardSwitch: true };
  }>[];
}

export const HeroSwitchReviewTable = ({
  reviews,
}: HeroSwitchReviewTableProps) => {
  return (
    <Table className="mt-2 w-full">
      <TableHeader>
        <TableRow className="p-0 m-0">
          <TableHead></TableHead>
          <TableHead className="text-center">Score</TableHead>
          <TableHead className="">Switch</TableHead>
          <TableHead className="text-right">Author</TableHead>
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
              <TableCell className="w-full max-w-[200px] truncate">
                {review.keyboardSwitch?.name}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-right">
                <Link href={`/users/${review.author?.handle}`}>
                  <div className="space-x-2 flex flex-row items-center">
                    <Avatar className="cursor-pointer h-4 w-4">
                      <AvatarFallback>
                        <PrettyAvatar
                          colors={["#5B756C", "#748B83", "#9A947C"]}
                          name={review.author?.handle ?? "user"}
                          variant="smile"
                          size={10000000}
                        />
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="">@{review.author?.handle}</h1>
                  </div>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total Reviews</TableCell>
          <TableCell className="text-right">{reviews.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
