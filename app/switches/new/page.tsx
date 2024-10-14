"use client";

import { Editor } from "@/components/editor";
import { SwitchSearch } from "@/components/switch-search";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  travel: z.number().min(0).max(100),
  weight: z.number().min(0).max(100),
  feel: z.number().min(0).max(100),
  sound: z.number().min(0).max(100),
  typing: z.number().min(0).max(100),
  title: z.string().max(128).optional(),
});

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
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  name: keyof z.infer<typeof formSchema>;
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

export default function NewReview() {
  const [selectedSwitch, setSelectedSwitch] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel: 50,
      weight: 50,
      feel: 50,
      sound: 50,
      typing: 50,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const score =
    normalizedScore(form.watch("travel")) +
    normalizedScore(form.watch("weight")) +
    normalizedScore(form.watch("feel")) +
    normalizedScore(form.watch("sound")) +
    normalizedScore(form.watch("typing"));

  return (
    <div className="flex-1 w-full flex flex-col space-y-8">
      <h1 className="text-2xl font-semibold text-center">New Review</h1>
      <div className="w-full">
        <SwitchSearch onSelectSwitch={(id) => setSelectedSwitch(id)} />
      </div>
      <div className="text-center">
        <h2 className="font-black text-6xl">{score}/100</h2>
        <h2 className="text-xl">Score</h2>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormItem>
                <FormLabel>Review Title</FormLabel>
                <Input
                  placeholder="Great switch but..."
                  {...form.register("title")}
                />
                <FormDescription>
                  Summarize your review in one sentence
                </FormDescription>
              </FormItem>
            </div>
            <div className="mt-8">
              <Editor />
            </div>
            <LoadingButton type="submit" name="submit" className="w-full">
              Submit Review
            </LoadingButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
