import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { Prisma } from "@prisma/client";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserReviewTable } from "@/components/user-review-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "@/app/actions";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // see if they completed onboarding
  const data = await prismaClient.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!data) {
    return redirect("/onboarding");
  }

  const userData = await prismaClient.user.findFirst({
    where: {
      id: user.id,
    },
  });

  const reviews = await prismaClient.review.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      author: true,
    },
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          <div>
            This is your private dashboard. Only you can see this page.
            <p>
              If you want to see your public profile{" "}
              <Link href={`/users/${userData?.handle}`} className="underline">
                click here.
              </Link>
            </p>
          </div>
        </div>
      </div>
      {userData?.admin && (
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your user details</h2>
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
      <div>
        <h2 className="font-bold text-2xl mb-4">Reviews</h2>
        <UserReviewTable reviews={reviews} />
      </div>
      <div className="">
        <h2 className="font-bold text-2xl mb-4">Account Settings</h2>
        <Link href="/user/reset-password">
          <Button variant="link">Change Password</Button>
        </Link>
        {/* 
        TODO: This doesn't work atm
        <form>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers. Your
                  reviews will be removed and all data will be unrecoverable.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  formAction={deleteAccountAction}
                  type="submit"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form> */}
      </div>
    </div>
  );
}
