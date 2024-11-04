import { prismaClient } from "@/lib/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");

  if (!handle || handle.length < 3 || handle.length > 120) {
    return Response.json({ error: "Invalid handle", available: false });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      handle: {
        equals: handle,
        mode: "insensitive",
      },
    },
  });

  if (!user) {
    return Response.json({ error: null, available: true });
  }

  return Response.json({ error: "Handle is already taken", available: false });
}
