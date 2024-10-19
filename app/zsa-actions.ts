"use server";

import { createServerAction } from "zsa";
import { onboardingFormSchema, reviewFormSchema } from "./schemas";
import { createClient } from "@/utils/supabase/server";
import { prismaClient } from "@/lib/database";
import { redirect } from "next/navigation";

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

    return { success: true };
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

    const res = await prismaClient.review.create({
      data: {
        authorId: user!.id,
        switchId: input.switchId,
        ratings: {
          travel: input.travel,
          weight: input.weight,
          feel: input.feel,
          sound: input.sound,
          typing: input.typing,
        },
        title: input.title,
        content: input.body,
      },
    });

    console.log(res);

    return { success: true };
  });
