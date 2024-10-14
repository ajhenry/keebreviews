"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useFormState, useFormStatus } from "react-dom";
import { onboardingAction } from "@/app/actions";
import { z } from "zod";
import { onboardingFormSchema } from "@/app/schemas";

export default function UserOnboarding() {
  const [state, formAction] = useFormState(onboardingAction, {
    username: "",
    errors: {
      username: undefined,
    },
  });
  const { pending } = useFormStatus();

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      username: state?.username ?? "",
    },
  });

  const username = form.watch("username");

  const checkUsernameAvailability = async (username: string) => {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("User")
      .select("handle")
      .eq("handle", username);

    console.log(count, error);

    return count === 0 || !count;
  };

  console.log(form.formState.errors);
  console.log(/^[a-zA-Z0-9_-]*$/.test(username));

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

  const onSubmit = (data: z.infer<typeof onboardingFormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
          loading={pending}
        >
          Submit Review
        </LoadingButton>
      </form>
    </Form>
  );
}
