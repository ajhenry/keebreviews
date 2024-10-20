import { Review } from "@prisma/client";
import { Slider } from "./ui/slider";
import { Ratings, ratingsMap } from "@/utils/score";

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
        low={ratingsMap.travel.low}
        middle={ratingsMap.travel.middle}
        high={ratingsMap.travel.high}
        label={ratingsMap.travel.label}
      />
      <RatingSlider
        value={weight}
        low={ratingsMap.weight.low}
        middle={ratingsMap.weight.middle}
        high={ratingsMap.weight.high}
        label={ratingsMap.weight.label}
      />
      <RatingSlider
        value={sound}
        low={ratingsMap.sound.low}
        middle={ratingsMap.sound.middle}
        high={ratingsMap.sound.high}
        label={ratingsMap.sound.label}
      />
      <RatingSlider
        value={typing}
        low={ratingsMap.typing.low}
        middle={ratingsMap.typing.middle}
        high={ratingsMap.typing.high}
        label={ratingsMap.typing.label}
      />
      <RatingSlider
        value={feel}
        low={ratingsMap.feel.low}
        middle={ratingsMap.feel.middle}
        high={ratingsMap.feel.high}
        label={ratingsMap.feel.label}
      />
    </div>
  );
};
