"use client";

import { reviewFormSchema } from "@/app/schemas";
import { createReviewAction } from "@/app/zsa-actions";
import { Editor } from "@/components/editor";
import { SwitchSearch } from "@/components/switch-search";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";

const normalizedScore = (score: number) => {
  return (100 - Math.abs(50 - score) * 2) / 5;
};

const RatingSlider = ({
  form,
  name,
  low,
  middle,
  high,
  label,
  description,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof reviewFormSchema>>>;
  name: keyof z.infer<typeof reviewFormSchema>;
  low: string;
  middle: string;
  high: string;
  label: string;
  description: string;
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormDescription>{description}</FormDescription>
      <div>
        <Slider
          defaultValue={[form.getValues(name) as number]}
          onValueChange={(val) => {
            form.setValue(name, val[0]);
          }}
          max={100}
          min={0}
          step={5}
        />
        <h2 className="text-sm flex justify-between mt-1">
          <span>{low}</span>
          <span className="absolute left-1/2 transform -translate-x-1/2">
            {middle}
          </span>
          <span>{high}</span>
        </h2>
      </div>
    </FormItem>
  );
};

export function SwitchReviewForm() {
  const { execute, isPending } = useServerAction(createReviewAction);
  const form = useForm<z.infer<typeof reviewFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      switchId: "",
      travel: 50,
      weight: 50,
      feel: 50,
      sound: 50,
      typing: 50,
    },
  });

  const onSubmit = async (data: z.infer<typeof reviewFormSchema>) => {
    console.log(data);

    if (data.switchId === "") {
      form.setError("switchId", {
        type: "manual",
        message: "Switch is required",
      });
      return;
    }

    const result = await execute(data);
    console.log(result);
  };

  const score =
    normalizedScore(form.watch("travel")) +
    normalizedScore(form.watch("weight")) +
    normalizedScore(form.watch("feel")) +
    normalizedScore(form.watch("sound")) +
    normalizedScore(form.watch("typing"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex-1 w-full flex flex-col space-y-8">
          <h1 className="text-2xl font-semibold text-center">New Review</h1>
          <div className="w-full space-y-1">
            <SwitchSearch
              onSelectSwitch={(id) => {
                form.clearErrors("switchId");
                form.setValue("switchId", id);
              }}
            />
            <FormDescription className="text-destructive">
              {form.formState.errors.switchId?.message}
            </FormDescription>
          </div>
          <div className="text-center">
            <h2 className="font-black text-6xl">{score}/100</h2>
            <h2 className="text-xl">Score</h2>
          </div>
          <div className="w-full space-y-8">
            <RatingSlider
              form={form}
              name="travel"
              low="Too Short"
              middle="Perfect Travel"
              high="Too Long"
              label="Travel"
              description="How far does the switch travel?"
            />
            <RatingSlider
              form={form}
              name="weight"
              low="Too Light"
              middle="Perfect Weight"
              high="Too Heavy"
              label="Weight"
              description="How heavy is the switch?"
            />
            <RatingSlider
              form={form}
              name="sound"
              low="Too Quiet"
              middle="Perfect Sound"
              high="Too Loud"
              label="Sound"
              description="How loud is the switch?"
            />
            <RatingSlider
              form={form}
              name="typing"
              low="Better for Gaming"
              middle="Perfect for Both"
              high="Better for Typing"
              label="Typing"
              description="How does the switch feel for typing?"
            />
            <RatingSlider
              form={form}
              name="feel"
              low="Too Scratchy"
              middle="Perfect Feel"
              high="Too Loose"
              label="Feel"
              description="How does the overall switch feel?"
            />
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Great switch but..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Summarize your review in one sentence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8">
              <Editor onContentChange={(html) => form.setValue("body", html)} />
            </div>
            <LoadingButton
              type="submit"
              name="submit"
              className="w-full"
              loading={isPending}
            >
              Submit Review
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
