"use server";

import { createServerAction } from "zsa";
import { onboardingFormSchema, reviewFormSchema } from "./schemas";
import { createClient } from "@/utils/supabase/server";
import { prismaClient } from "@/lib/database";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSwitchById } from "@/switchdb/src";
import {
  Ratings,
  addToRunningAverage,
  generateScore,
  removeFromRunningAverage,
  updateRunningAverage,
} from "@/utils/score";
import { Json } from "@/database.types";
import { InputJsonValue } from "@prisma/client/runtime/library";

export const onboardingAction = createServerAction()
  .input(onboardingFormSchema)
  .handler(async ({ input }) => {
    const { username, name } = input;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not found" };
    }

    // Check if the handle already exists
    const userExists = await prismaClient.user.findFirst({
      where: {
        handle: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (userExists) {
      return { error: "Handle already exists" };
    }

    const result = await prismaClient.user.upsert({
      update: {
        handle: username,
        email: user!.email!,
        name: name,
      },
      create: {
        id: user!.id,
        handle: username,
        email: user!.email!,
        name: name,
      },
      where: {
        id: user!.id,
      },
    });

    return { success: true, data: result };
  });

export const signOutAction = createServerAction().handler(async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
});

export const createReviewAction = createServerAction()
  .input(reviewFormSchema)
  .handler(async ({ input }) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const switchData = getSwitchById(input.switchId);

    if (!switchData) {
      throw new Error("Switch not found");
    }

    const score = generateScore({
      travel: input.travel,
      weight: input.weight,
      feel: input.feel,
      sound: input.sound,
      typing: input.typing,
    });

    // Find the switch by ID, and if it doesn't exist, create it
    let keyboardSwitch = await prismaClient.keyboardSwitch.findFirst({
      where: {
        id: switchData.id,
      },
    });

    // kb switch doesn't exist, create it
    if (!keyboardSwitch) {
      keyboardSwitch = await prismaClient.keyboardSwitch.create({
        data: {
          id: switchData.id,
          name: switchData.friendlyName,
          averageRatings: {
            travel: input.travel,
            weight: input.weight,
            feel: input.feel,
            sound: input.sound,
            typing: input.typing,
          },
          reviewsCount: 0,
          averageScore: score,
        },
      });
    }

    if (!keyboardSwitch) {
      throw new Error("Failed to create switch");
    }

    const res = await prismaClient.review.create({
      data: {
        authorId: user!.id,
        ratings: {
          travel: input.travel,
          weight: input.weight,
          feel: input.feel,
          sound: input.sound,
          typing: input.typing,
        },
        score: score,
        title: input.title,
        content: input.body,
        keyboardSwitchId: switchData.id,
      },
      select: {
        author: {
          select: {
            handle: true,
          },
        },
      },
    });

    // Update the average ratings and score for the switch
    const newAverages = addToRunningAverage(
      keyboardSwitch.averageRatings,
      {
        travel: input.travel,
        weight: input.weight,
        feel: input.feel,
        sound: input.sound,
        typing: input.typing,
      },
      keyboardSwitch.reviewsCount + 1
    );

    await prismaClient.keyboardSwitch.update({
      where: {
        id: switchData.id,
      },
      data: {
        averageRatings: newAverages.newRatings,
        averageScore: newAverages.newScore,
        reviewsCount: keyboardSwitch.reviewsCount + 1,
      },
    });

    return {
      success: true,
      redirect: `/switches/${input.switchId}/reviews/${res.author?.handle}`,
    };
  });

export const updateReviewAction = createServerAction()
  .input(reviewFormSchema)
  .handler(async ({ input }) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const switchData = getSwitchById(input.switchId);

    if (!switchData) {
      throw new Error("Switch not found");
    }

    const score = generateScore({
      travel: input.travel,
      weight: input.weight,
      feel: input.feel,
      sound: input.sound,
      typing: input.typing,
    });

    // Find the switch by ID, and if it doesn't exist, create it
    let keyboardSwitch = await prismaClient.keyboardSwitch.findFirst({
      where: {
        id: switchData.id,
      },
    });

    // kb switch doesn't exist, create it
    if (!keyboardSwitch) {
      keyboardSwitch = await prismaClient.keyboardSwitch.create({
        data: {
          id: switchData.id,
          name: switchData.friendlyName,
          averageRatings: {
            travel: input.travel,
            weight: input.weight,
            feel: input.feel,
            sound: input.sound,
            typing: input.typing,
          },
          reviewsCount: 0,
          averageScore: score,
        },
      });
    }

    if (!keyboardSwitch) {
      throw new Error("Failed to create switch");
    }

    // Fetch the existing review
    const existingReview = await prismaClient.review.findFirst({
      where: {
        authorId: user!.id,
        keyboardSwitchId: switchData.id,
      },
    });

    if (!existingReview) {
      throw new Error("Review not found");
    }

    const res = await prismaClient.review.update({
      where: {
        id: existingReview!.id,
      },
      data: {
        authorId: user!.id,
        ratings: {
          travel: input.travel,
          weight: input.weight,
          feel: input.feel,
          sound: input.sound,
          typing: input.typing,
        },
        score: score,
        title: input.title,
        content: input.body,
      },
      select: {
        author: {
          select: {
            handle: true,
          },
        },
      },
    });

    // Update the average ratings and score for the switch
    const newAverages = updateRunningAverage(
      keyboardSwitch.averageRatings,
      existingReview.ratings,
      {
        travel: input.travel,
        weight: input.weight,
        feel: input.feel,
        sound: input.sound,
        typing: input.typing,
      },
      keyboardSwitch.reviewsCount
    );

    await prismaClient.keyboardSwitch.update({
      where: {
        id: switchData.id,
      },
      data: {
        averageRatings: newAverages.newRatings,
        averageScore: newAverages.newScore,
      },
    });

    return {
      success: true,
      redirect: `/switches/${input.switchId}/reviews/${res.author?.handle}`,
    };
  });

export const deleteReviewAction = createServerAction()
  .input(
    z.object({
      reviewId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const { reviewId } = input;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not found" };
    }

    const review = await prismaClient.review.delete({
      where: {
        id: reviewId,
        authorId: user!.id,
      },
    });

    // We need to update the average ratings for the switch
    const switchData = getSwitchById(review.keyboardSwitchId);

    if (!switchData) {
      throw new Error("Switch not found");
    }

    let keyboardSwitch = await prismaClient.keyboardSwitch.findFirst({
      where: {
        id: switchData.id,
      },
    });

    if (!keyboardSwitch) {
      throw new Error("Switch not found");
    }

    const newAverages = removeFromRunningAverage(
      keyboardSwitch.averageRatings,
      review.ratings,
      keyboardSwitch.reviewsCount - 1
    );

    await prismaClient.keyboardSwitch.update({
      where: {
        id: switchData.id,
      },
      data: {
        averageRatings: newAverages.newRatings,
        averageScore: newAverages.newScore,
        reviewsCount: keyboardSwitch.reviewsCount - 1,
      },
    });

    return { success: true };
  });

export const updateReviewVisibilityAction = createServerAction()
  .input(
    z.object({
      reviewId: z.string(),
      visibility: z.boolean(),
    })
  )
  .handler(async ({ input }) => {
    const { reviewId, visibility } = input;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not found" };
    }

    const review = await prismaClient.review.update({
      where: {
        id: reviewId,
        authorId: user!.id,
      },
      data: {
        published: visibility,
      },
    });

    return { success: true };
  });

// Fetches all the switch ratings and the count of ratings for all switches
export const getAllSwitchRatings = createServerAction().handler(async () => {
  const allRatings = await prismaClient.review.aggregate({});
});
