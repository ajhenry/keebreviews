import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatForce, formatTravel } from "@/utils/force";
import { MechanicalKeySwitch } from "@/switchdb/src";

interface Spec {
  label: string;
  value: string | JSX.Element | number | undefined;
}

export default async function KeyboardSwitchInfoTable({
  keyboardSwitch,
}: {
  keyboardSwitch: MechanicalKeySwitch;
}) {
  const specs: Spec[] = [
    {
      label: "Model",
      value: keyboardSwitch?.spec.model,
    },
    {
      label: "Variation",
      value: keyboardSwitch?.spec.variation,
    },
  ];

  // if the switch is a linear, we need to show force and travel
  if (keyboardSwitch?.spec.force.actuation) {
    specs.push({
      label: "Actuation Force",
      value: formatForce(keyboardSwitch?.spec.force.actuation),
    });
  }
  if (keyboardSwitch?.spec.force.bottom) {
    specs.push({
      label: "Bottom Out Force",
      value: formatForce(keyboardSwitch?.spec.force.bottom),
    });
  }
  if (keyboardSwitch?.spec.travel.pre) {
    specs.push({
      label: "Pre-Travel",
      value: formatTravel(keyboardSwitch?.spec.travel.pre),
    });
  }
  if (keyboardSwitch?.spec.travel.total) {
    specs.push({
      label: "Total Travel",
      value: formatTravel(keyboardSwitch?.spec.travel.total),
    });
  }
  if (
    keyboardSwitch?.spec.type === "tactile" ||
    keyboardSwitch?.spec.type === "clicky"
  ) {
    if (keyboardSwitch?.spec.force.tactile) {
      specs.push({
        label: "Tactile Force",
        value: formatForce(keyboardSwitch?.spec.force.tactile),
      });
    }
    if (keyboardSwitch?.spec.travel.pressure) {
      specs.push({
        label: "Tactile Pressure",
        value: formatTravel(keyboardSwitch?.spec.travel.pressure),
      });
    }
  }

  specs.push(
    ...([
      {
        label: "Profile",
        value: keyboardSwitch?.spec.profile,
      },
      {
        label: "Stem",
        value: keyboardSwitch?.spec.stem.design,
      },
      {
        label: "Mount",
        value: keyboardSwitch?.spec.mount,
      },
      {
        label: "Type",
        value: keyboardSwitch?.spec.type,
      },
      {
        label: "Lifetime",
        value: keyboardSwitch?.spec.lifetime,
      },
      {
        label: "Lighting",
        value: keyboardSwitch?.spec.lighting,
      },
      {
        label: "Lubrication",
        value: keyboardSwitch?.spec.lubrication,
      },
      {
        label: "Volume",
        value: keyboardSwitch?.spec.volume,
      },
      {
        label: "Spring Form",
        value: keyboardSwitch?.spec.spring?.form ?? "",
      },
    ] as any)
  );

  if (keyboardSwitch?.spec.datasheet) {
    specs.push({
      label: "Datasheet",
      value: (
        <a
          href={keyboardSwitch?.spec.datasheet}
          target="_blank"
          rel="noreferrer"
        >
          Link
        </a>
      ),
    });
  }

  return (
    <div>
      <Table className="">
        <TableBody className="">
          {specs.map((spec) => (
            <TableRow className="" key={spec.label}>
              <TableCell className="font-medium">{spec.label}</TableCell>
              <TableCell className="text-right">
                {spec.value || "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
