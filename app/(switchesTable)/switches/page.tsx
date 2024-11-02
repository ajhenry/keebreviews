import { SwitchesTable } from "@/components/switches-table";
import { prismaClient } from "@/lib/database";
import { KeyboardSwitch } from "@prisma/client";

export default async function SwitchesTablePage() {
  const allKeyboardSwitches = await prismaClient.keyboardSwitch.findMany();

  const switchRatings: Record<string, KeyboardSwitch> = {};

  for (const keyboardSwitch of allKeyboardSwitches) {
    switchRatings[keyboardSwitch.id] = keyboardSwitch;
  }

  return <SwitchesTable switchRatings={switchRatings} />;
}
