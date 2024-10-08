"use client";

import { Editor } from "@/components/editor";
import { SwitchSearch } from "@/components/switch-search";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
import { search } from "@/switchdb/src";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  travel: z.number().min(0).max(100),
  weight: z.number().min(0).max(100),
  feel: z.number().min(0).max(100),
  sound: z.number().min(0).max(100),
  typing: z.number().min(0).max(100),
  gaming: z.number().min(0).max(100),
});

// import the switches from the switches file to search from
console.log(search("hello"));

export default function NewReview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel: 50,
      weight: 50,
      feel: 50,
      sound: 50,
      typing: 50,
      gaming: 50,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const RatingSlider = ({
    form,
    name,
    low,
    high,
    label,
    description,
  }: {
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    name: keyof z.infer<typeof formSchema>;
    low: string;
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
            defaultValue={[form.getValues(name)]}
            onValueChange={(val) => form.setValue(name, val[0])}
            max={100}
            min={0}
            step={5}
          />
          <h2 className="text-sm flex justify-between mt-1">
            <span>{low}</span>
            <span>{high}</span>
          </h2>
        </div>
        <div>
          <Editor />
        </div>
      </FormItem>
    );
  };

  return (
    <div className="flex-1 w-full flex flex-col space-y-8">
      <div className="w-full">
        <SwitchSearch />
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <RatingSlider
              form={form}
              name="travel"
              low="Too Short"
              high="Too Long"
              label="Travel"
              description="How far does the switch travel?"
            />
            <RatingSlider
              form={form}
              name="weight"
              low="Too Light"
              high="Too Heavy"
              label="Weight"
              description="How heavy is the switch?"
            />
            <RatingSlider
              form={form}
              name="sound"
              low="Too Quiet"
              high="Too Loud"
              label="Sound"
              description="How loud is the switch?"
            />
            <RatingSlider
              form={form}
              name="typing"
              low="Bad"
              high="Great"
              label="Typing"
              description="How does the switch feel for typing?"
            />
            <FormItem>
              <FormLabel>Feel</FormLabel>
              <FormDescription>
                How does the switch feel? Too Scratchy, smooth, wobbly?
              </FormDescription>
              <div>
                <Slider
                  defaultValue={[form.getValues("feel")]}
                  onValueChange={(val) => form.setValue("feel", val[0])}
                  max={100}
                  min={0}
                  step={5}
                />
                <h2 className="text-sm flex justify-between mt-1">
                  <span>Bad</span>
                  <span>Great</span>
                </h2>
              </div>
              <div>
                <Editor />
              </div>
            </FormItem>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
