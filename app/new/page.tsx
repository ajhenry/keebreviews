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

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="w-full">
        <SwitchSearch />
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
