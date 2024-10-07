"use client";

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
  feel: z.number().min(0).max(100),
  weight: z.number().min(0).max(100),
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
      feel: 50,
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
            <Slider />
            <FormField
              control={form.control}
              name="smoothness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Smoothness</FormLabel>
                  <FormControl>
                    <div className="flex items-center py-4">
                      <Input
                        placeholder="50"
                        className="max-w-28 pr-14 text-xl font-semibold"
                        {...field}
                      />
                      <span className="flex flex-row transform -translate-x-full pr-2 text-xl font-semibold">
                        <span className="mx-1">/</span>100
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          Hello
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
