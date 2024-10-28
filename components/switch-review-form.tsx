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
import { generateScore, normalizedScore, ratingsMap } from "@/utils/score";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { Slider as NextSlider } from "@nextui-org/slider";
import { Alert } from "./ui/alert";

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
        <NextSlider
          classNames={{
            track: "bg-secondary h-3",
          }}
          className="outline-background"
          aria-label={`${label} rating`}
          step={2}
          minValue={-20}
          maxValue={20}
          fillOffset={0}
          defaultValue={form.getValues(name) as number}
          onChange={(val) => {
            form.setValue(name, val.valueOf() as number);
          }}
          showSteps
          showTooltip
          tooltipProps={{
            content: (
              <div>
                {form.getValues(name) == 0 ? "" : "-"}
                {Math.abs(form.getValues(name)?.valueOf() as number)}
              </div>
            ),
          }}
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
  const { execute, isPending, isError } = useServerAction(createReviewAction);
  const router = useRouter();
  const form = useForm<z.infer<typeof reviewFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      switchId: "",
      travel: 0,
      weight: 0,
      feel: 0,
      sound: 0,
      typing: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof reviewFormSchema>) => {
    console.log("data");
    console.log(data);

    if (data.switchId === "") {
      form.setError("switchId", {
        type: "manual",
        message: "Switch is required",
      });
      return;
    }

    const [res, error] = await execute(data);
    console.log(res, error);

    if (res?.success) {
      router.push(res.redirect);
    }
  };

  const score = generateScore({
    travel: form.watch("travel"),
    weight: form.watch("weight"),
    feel: form.watch("feel"),
    sound: form.watch("sound"),
    typing: form.watch("typing"),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex-1 w-full flex flex-col space-y-8">
          {isError && (
            <Alert variant="destructive" className="w-full">
              Something went wrong. Please try again.
            </Alert>
          )}
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
            {Object.values(ratingsMap).map((ratingCategory) => (
              <RatingSlider
                form={form}
                key={ratingCategory.name}
                name={
                  ratingCategory.name as keyof z.infer<typeof reviewFormSchema>
                }
                low={ratingCategory.low}
                middle={ratingCategory.middle}
                high={ratingCategory.high}
                label={ratingCategory.label}
                description={ratingCategory.description}
              />
            ))}
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
              onClick={() => onSubmit(form.getValues())}
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
