import { Review } from "@prisma/client";
import { Slider } from "./ui/slider";
import { Ratings } from "@/utils/score";

export const RatingSlider = ({
  value,
  low,
  middle,
  high,
  label,
}: {
  value: number;
  low: string;
  middle: string;
  high: string;
  label: string;
}) => {
  return (
    <div>
      <h3 className="font-bold">{label}</h3>
      <Slider defaultValue={[value]} max={100} min={0} step={5} disabled />
      <h4 className="text-sm flex justify-between mt-1 text-muted-foreground">
        <span>{low}</span>
        <span className="absolute left-1/2 transform -translate-x-1/2">
          {middle}
        </span>
        <span>{high}</span>
      </h4>
    </div>
  );
};

export const TotalReviewSlider = ({ review }: { review: Review }) => {
  const { travel, weight, feel, sound, typing } =
    review.ratings as unknown as Ratings;

  return (
    <div className="space-y-2 max-w-[600px] w-full">
      <RatingSlider
        value={travel}
        low="Too Short"
        middle="Perfect Travel"
        high="Too Long"
        label="Travel"
      />
      <RatingSlider
        value={weight}
        low="Too Light"
        middle="Perfect Weight"
        high="Too Heavy"
        label="Weight"
      />
      <RatingSlider
        value={sound}
        low="Too Quiet"
        middle="Perfect Sound"
        high="Too Loud"
        label="Sound"
      />
      <RatingSlider
        value={typing}
        low="Better for Gaming"
        middle="Perfect for Both"
        high="Better for Typing"
        label="Typing"
      />
      <RatingSlider
        value={feel}
        low="Too Scratchy"
        middle="Perfect Feel"
        high="Too Loose"
        label="Feel"
      />
    </div>
  );
};
