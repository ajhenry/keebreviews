import { Review } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";

export const ReviewContent = ({ review }: { review: Review }) => {
  const sanitizedContent = DOMPurify.sanitize(review.content ?? "");

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      className="prose dark:prose-invert prose-sm sm:prose lg:prose-md"
    />
  );
};
