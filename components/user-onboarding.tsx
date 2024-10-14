"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { LoadingButton } from "./ui/loading-button";
import { Input } from "./ui/input";
import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import { useFormState } from "react-dom";
import { useServerAction } from "zsa-react";
import { onboardingAction } from "@/app/zsa-actions";
import { onboardingFormSchema } from "@/app/schemas";
import { useRouter } from "next/router";

export default function UserOnboarding() {
  const { isPending, execute, data } = useServerAction(onboardingAction);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      username: "",
      name: "",
    },
  });

  useEffect(() => {
    // redirect to the home page after onboarding is complete
    if (data?.success) {
      router.replace("/");
    }
  }, [data]);

  const username = form.watch("username");

  const checkUsernameAvailability = async (username: string) => {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("User")
      .select("handle")
      .eq("handle", username);

    return (count === 0 || !count) && !error;
  };

  // Custom debounce function
  const debouncedCheck = (username: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      const available = await checkUsernameAvailability(username);
      setIsAvailable(available);
    }, 300);
  };

  useEffect(() => {
    if (username) {
      debouncedCheck(username);
    } else {
      setIsAvailable(null);
    }
    // Cleanup function to cancel debounce on unmount
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [username]);

  const onSubmit = async (data: z.infer<typeof onboardingFormSchema>) => {
    if (!isAvailable) {
      return;
    }

    await execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormDescription>Your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                {username && isAvailable && !form.formState.errors.username && (
                  <span>Username is available</span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          name="submit"
          className="w-full"
          loading={isPending}
        >
          Complete Onboarding
        </LoadingButton>
      </form>
    </Form>
  );
}
