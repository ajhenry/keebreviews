import * as z from "zod";

export const onboardingFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be 3 characters or more")
    .max(36, "Username must be 36 characters or fewer")
    // check if there's only alphanumeric characters and dashes and underscores
    .refine(
      (username) =>
        // check if there's only alphanumeric characters and dashes and underscores
        /^[a-zA-Z0-9_-]*$/.test(username),
      {
        message:
          "Username can only contain letters, numbers, dashes, and underscores",
      }
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(64, "Name must be 64 characters or fewer"),
});
