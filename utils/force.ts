import { Force, ForceUnit, Travel } from "@/switchdb/src/types";

export const formatTravel = (travel: Travel) => {
  let base = `${travel.value}`;

  if (travel.tolerance) {
    base += ` ${
      travel.tolerance?.sign === "plus_minus"
        ? "±"
        : travel.tolerance?.sign === "minus"
          ? "-"
          : ""
    } ${travel.tolerance?.value}${travel.unit}`;
  } else {
    base += `${travel.unit}`;
  }

  return base;
};

export const formatForce = (force: Force) => {
  if (force.unit === "cn") {
    // convert to gf
    force.convert(ForceUnit.GramForce);
  }

  let base = `${force.value}`;

  if (force.tolerance) {
    base += ` ${
      force.tolerance?.sign === "plus_minus"
        ? "±"
        : force.tolerance?.sign === "minus"
          ? "-"
          : ""
    } ${force.tolerance?.value}${force.unit}`;
  } else {
    base += `${force.unit}`;
  }

  return base;
};
