import { JsonObject, JsonValue } from "@prisma/client/runtime/library";

export interface Ratings {
  travel: number;
  weight: number;
  feel: number;
  sound: number;
  typing: number;
}

// normalizes a single score from 50 to a 0-100 scale
export const normalizedScore = (score: number) => {
  return (100 - Math.abs(50 - score) * 2) / 5;
};

// generates the total score for a set of scores
export const generateScore = (ratings: Record<string, number> | JsonValue) => {
  const scores = ratings as unknown as Ratings;

  const normalizedScores = Object.fromEntries(
    Object.entries(scores).map(([key, value]) => [key, normalizedScore(value)])
  );
  return Object.values(normalizedScores).reduce((acc, val) => acc + val, 0);
};
