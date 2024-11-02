import { signInAction, signInWithProviderAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Icons } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </div>
      <FormMessage message={searchParams} />
      <div className={cn("grid gap-6")}>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                name="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
              />
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <SubmitButton
              pendingText="Signing In..."
              formAction={signInAction}
              className="w-full"
            >
              Sign in
            </SubmitButton>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign in with
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <form className="w-full">
            <input type="hidden" name="provider" value="google" />
            <Button
              variant="outline"
              type="submit"
              formAction={signInWithProviderAction}
              className="w-full"
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </form>
          <form className="w-full">
            <input type="hidden" name="provider" value="github" />
            <Button
              variant="outline"
              type="submit"
              formAction={signInWithProviderAction}
              className="w-full"
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
