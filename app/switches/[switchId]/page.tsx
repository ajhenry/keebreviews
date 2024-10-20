import { getSwitchById } from "@/switchdb/src/search";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Force, ForceUnit, Travel } from "@/switchdb/src/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatForce, formatTravel } from "@/utils/force";

interface Spec {
  label: string;
  value: string | JSX.Element | number | undefined;
}

export default function NewReview({
  params,
}: {
  params: { switchId: string };
}) {
  const { switchId } = params;
  const kbSwitch = getSwitchById(switchId);

  const specs: Spec[] = [
    {
      label: "Model",
      value: kbSwitch?.spec.model,
    },
    {
      label: "Variation",
      value: kbSwitch?.spec.variation,
    },
  ];

  // if the switch is a linear, we need to show force and travel
  if (kbSwitch?.spec.force.actuation) {
    specs.push({
      label: "Actuation Force",
      value: formatForce(kbSwitch?.spec.force.actuation),
    });
  }
  if (kbSwitch?.spec.force.bottom) {
    specs.push({
      label: "Bottom Out Force",
      value: formatForce(kbSwitch?.spec.force.bottom),
    });
  }
  if (kbSwitch?.spec.travel.pre) {
    specs.push({
      label: "Pre-Travel",
      value: formatTravel(kbSwitch?.spec.travel.pre),
    });
  }
  if (kbSwitch?.spec.travel.total) {
    specs.push({
      label: "Total Travel",
      value: formatTravel(kbSwitch?.spec.travel.total),
    });
  }
  if (kbSwitch?.spec.type === "tactile" || kbSwitch?.spec.type === "clicky") {
    if (kbSwitch?.spec.force.tactile) {
      specs.push({
        label: "Tactile Force",
        value: formatForce(kbSwitch?.spec.force.tactile),
      });
    }
    if (kbSwitch?.spec.travel.pressure) {
      specs.push({
        label: "Tactile Pressure",
        value: formatTravel(kbSwitch?.spec.travel.pressure),
      });
    }
  }

  specs.push(
    ...([
      {
        label: "Profile",
        value: kbSwitch?.spec.profile,
      },
      {
        label: "Stem",
        value: kbSwitch?.spec.stem.design,
      },
      {
        label: "Mount",
        value: kbSwitch?.spec.mount,
      },
      {
        label: "Type",
        value: kbSwitch?.spec.type,
      },
      {
        label: "Lifetime",
        value: kbSwitch?.spec.lifetime,
      },
      {
        label: "Lighting",
        value: kbSwitch?.spec.lighting,
      },
      {
        label: "Lubrication",
        value: kbSwitch?.spec.lubrication,
      },
      {
        label: "Volume",
        value: kbSwitch?.spec.volume,
      },
      {
        label: "Spring Form",
        value: kbSwitch?.spec.spring?.form ?? "",
      },
    ] as any)
  );

  if (kbSwitch?.spec.datasheet) {
    specs.push({
      label: "Datasheet",
      value: (
        <a href={kbSwitch?.spec.datasheet} target="_blank" rel="noreferrer">
          Link
        </a>
      ),
    });
  }

  const switchName = `${kbSwitch?.brand.name} ${kbSwitch?.spec.model}`;

  return (
    <div className="flex-1 w-full flex flex-col space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/switches">Switches</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/switches/${kbSwitch?.brand.name}`}>
              {kbSwitch?.brand.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{switchName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="">
        <h1 className="text-4xl font-bold">
          {kbSwitch?.friendlyName}{" "}
          <Badge className="capitalize">{kbSwitch?.spec.type}</Badge>
        </h1>
        <h2 className="text-2xl font-semibold mt-4">Specs</h2>
        <div>
          <Table className="">
            <TableBody className="">
              {specs.map((spec) => (
                <TableRow className="">
                  <TableCell className="font-medium">{spec.label}</TableCell>
                  <TableCell className="text-right">
                    {spec.value || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <Link href={`/switches/reviews/new`}>
            <Button variant="outline">Submit Review</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
