import Link from "next/link";
import { HeroSwitchSearch } from "./hero-switch-search";
import { Button } from "./ui/button";
import { prismaClient } from "@/lib/database";
import { HeroSwitchReviewTable } from "./hero-switch-review-table";

export default async function Header() {
  const recentReviews = await prismaClient.review.findMany({
    include: {
      author: true,
      keyboardSwitch: true,
    },
    take: 10,
  });

  return (
    <div className="flex flex-col gap-16 items-center mt-12">
      <section className="">
        <div className="container text-center">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
            <h1 className="text-3xl font-extrabold lg:text-6xl">
              Community Powered Keyboard Reviews
            </h1>
            <p className="text-balance text-muted-foreground lg:text-lg">
              A place to find and share reviews of keyboard switches.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full">
        <HeroSwitchSearch />
        <div className="relative my-6 mx-16">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <Link href="switches">
          <Button variant="link" className="w-full text-lg h-12">
            Browse all switches
          </Button>
        </Link>
      </section>
      <section className="w-full">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          Recent Reviews
        </h2>
        <p className="text-balance text-muted-foreground lg:text-base mt-2 text-center">
          Recent reviews from the community.
        </p>
        <HeroSwitchReviewTable reviews={recentReviews} />
      </section>
    </div>
  );
}
