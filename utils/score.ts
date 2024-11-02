import { JsonObject, JsonValue } from "@prisma/client/runtime/library";

export interface Ratings {
  travel: number;
  weight: number;
  feel: number;
  sound: number;
  typing: number;
}

export const ratingToLabel = (ratings: Ratings) => {
  const labelMap = {} as Record<keyof Ratings, string>;

  for (const [category, score] of Object.entries(ratings)) {
    const lowLabel = ratingsMap[category as keyof Ratings].low as string;
    const middleLabel = ratingsMap[category as keyof Ratings].middle as string;
    const highLabel = ratingsMap[category as keyof Ratings].high as string;

    labelMap[category as keyof Ratings] =
      score == 0 ? middleLabel : score > 0 ? highLabel : lowLabel;
  }

  return labelMap;
};

export const ratingsMap = {
  travel: {
    name: "travel",
    low: "Too Short",
    middle: "Perfect Travel",
    high: "Too Long",
    label: "Travel",
    description: "How far does the switch travel?",
  },
  weight: {
    name: "weight",
    low: "Too Light",
    middle: "Perfect Weight",
    high: "Too Heavy",
    label: "Weight",
    description: "How heavy is the switch?",
  },
  sound: {
    name: "sound",
    low: "Too Soft",
    middle: "Perfect Sound",
    high: "Too Loud",
    label: "Sound",
    description: "How loud is the switch?",
  },
  typing: {
    name: "typing",
    low: "Better for Gaming",
    middle: "Perfect for Both",
    high: "Better for Typing",
    label: "Typing",
    description: "How does the switch feel for typing?",
  },
  feel: {
    name: "feel",
    low: "Underwhelming",
    middle: "Satisfying",
    high: "Overwhelming",
    label: "Feel",
    description: "How does the overall switch feel?",
  },
};

// normalizes a single score from 0 to a -50 to 50 scale
export const normalizedScore = (score: number) => {
  return (100 - Math.abs(score) * 5) / 5;
};

// generates the total score for a set of scores
export const generateScore = (
  ratings: Record<string, number> | JsonValue | Ratings
) => {
  const scores = ratings as unknown as Ratings;

  const normalizedScores = Object.fromEntries(
    Object.entries(scores).map(([key, value]) => [key, normalizedScore(value)])
  );
  return Object.values(normalizedScores).reduce((acc, val) => acc + val, 0);
};

export const calculateRunningAverage = (
  currentRatings: Record<string, number> | JsonValue,
  newScore: Ratings,
  totalEntries: number
) => {
  const newRatings: Ratings = {
    ...(currentRatings as unknown as Ratings),
  };

  // new average = old average * (n-1)/n + new value /n

  for (const [key, value] of Object.entries(newScore)) {
    newRatings[key as keyof Ratings] =
      newRatings[key as keyof Ratings] * ((totalEntries - 1) / totalEntries) +
      value / totalEntries;
  }

  const averageScore =
    (generateScore(currentRatings) * (totalEntries - 1)) / totalEntries +
    generateScore(newRatings) / totalEntries;

  return {
    newScore: averageScore,
    newRatings: newRatings,
  };
};
