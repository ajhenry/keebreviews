import { Editor } from "@/components/editor";
import { SwitchSearch } from "@/components/switch-search";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { getSwitchById } from "@/switchdb/src/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  travel: z.number().min(0).max(100),
  weight: z.number().min(0).max(100),
  feel: z.number().min(0).max(100),
  sound: z.number().min(0).max(100),
  typing: z.number().min(0).max(100),
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
          defaultValue={[form.getValues(name)]}
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
  const router = useRouter();
  const switchId = router.query.switchId as string;
  const kbSwitch = getSwitchById(switchId);

  console.log(switchId);
  console.log(kbSwitch);

  return (
    <div className="flex-1 w-full flex flex-col space-y-8">
      <h1 className="text-2xl font-semibold text-center">New Review</h1>
    </div>
  );
}
