import type { Ratings } from "@/utils/score";

declare global {
  namespace PrismaJson {
    // Insert your types here!
    export type PrismaRatings = Ratings;
  }
}
