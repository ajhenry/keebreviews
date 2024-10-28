"use client";

import { useMemo, useRef, useState } from "react";

import {
  type Column,
  type DataGridHandle,
  type SortColumn,
} from "react-data-grid";
import { MechanicalKeySwitch, getAllSwitches } from "@/switchdb/src";
import { Button } from "@/components/ui/button";
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import Link from "next/link";
import { formatForce, formatTravel } from "@/utils/force";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Fuse from "fuse.js";
const DataGrid = dynamic(() => import("react-data-grid"), { ssr: false });

interface SummaryRow {
  id: string;
  totalCount: number;
  yesCount: number;
}

type Row = MechanicalKeySwitch;

function rowKeyGetter(row: Row) {
  return row.id;
}

type Comparator = (a: Row, b: Row) => number;

function getComparator(sortColumn: string): Comparator {
  switch (sortColumn) {
    case "type":
      return (a, b) => {
        return a.spec[sortColumn] === b.spec[sortColumn]
          ? 0
          : a.spec[sortColumn] > b.spec[sortColumn]
            ? 1
            : -1;
      };
    case "friendlyName":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    case "score":
      return (a, b) => {
        return a === b ? 0 : a > b ? 1 : -1;
      };
    case "actuation":
    case "tactile":
    case "bottom":
      return (a, b) => {
        const aForce = (a.spec.force as any)?.[sortColumn]?.value;
        const bForce = (b.spec.force as any)?.[sortColumn]?.value;

        if (!aForce && !bForce) {
          return 0;
        }
        if (!aForce) {
          return -1;
        }
        if (!bForce) {
          return 1;
        }

        return aForce === bForce ? 0 : aForce > bForce ? 1 : -1;
      };

    case "pre":
    case "total":
      return (a, b) => {
        const aTravel = (a.spec.travel as any)?.[sortColumn]?.value;
        const bTravel = (b.spec.travel as any)?.[sortColumn]?.value;

        if (aTravel && bTravel) {
          return aTravel === bTravel ? 0 : aTravel > bTravel ? 1 : -1;
        }
        return 0;
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}

const searchSchema = z.object({
  search: z.string(),
});

export default function CommonFeatures() {
  const [rows, setRows] = useState(getAllSwitches());
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const gridRef = useRef<DataGridHandle>(null);
  const [selectedSwitchTypes, setSelectedSwitchTypes] = useState<string[]>([
    "linear",
    "tactile",
    "clicky",
  ]);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const headerClass = "bg-secondary p-0 outline-none min-w-min-content";

  const columns = useMemo(() => {
    const data: Column<Row, SummaryRow>[] = [
      {
        key: "type",
        name: "Type",
        sortable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Type
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        renderCell: (props) => {
          return (
            <Badge
              variant={
                props.row.spec.type === "linear"
                  ? "default"
                  : props.row.spec.type === "tactile"
                    ? "secondary"
                    : "destructive"
              }
            >
              {props.row.spec.type}
            </Badge>
          );
        },
        cellClass: "min-w-min-content",
      },
      {
        key: "friendlyName",
        name: "Name",
        frozen: false,
        resizable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Switch Name
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        renderCell: (props) => {
          return (
            <Link href={`/switches/${props.row.id}`} className="font-semibold">
              {props.row.friendlyName}
            </Link>
          );
        },
        cellClass: "w-[350px] sm:w-auto truncate",
      },
      {
        key: "score",
        name: "Score",
        sortable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Score
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        renderCell: (props) => {
          return <div className="text-center">100</div>;
        },
      },
      {
        key: "actuation",
        name: "Actuation",
        sortable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Actuation
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        renderCell: (props) => {
          return (
            <div className="text-center">
              {props.row.spec.force.actuation
                ? formatForce(props.row.spec.force.actuation)
                : "—"}
            </div>
          );
        },
      },
      {
        key: "tactile",
        name: "Tactile Force",
        sortable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Tactile Force
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        renderCell: (props) => {
          return (
            <div className="text-center">
              {props.row.spec.type === "tactile" && props.row.spec.force.tactile
                ? formatForce(props.row.spec.force.tactile)
                : "—"}
            </div>
          );
        },
      },
      {
        key: "bottom",
        name: "Bottom Out",
        sortable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Bottom Out
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        renderCell: (props) => {
          return (
            <div className="text-center">
              {props.row.spec.force.bottom
                ? formatForce(props.row.spec.force.bottom)
                : "—"}
            </div>
          );
        },
      },
      {
        key: "pre",
        name: "Pre-Travel",
        sortable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Pre-Travel
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },

        renderCell: (props) => {
          return (
            <div className="text-center">
              {props.row.spec.travel.pre
                ? formatTravel(props.row.spec.travel.pre)
                : "—"}
            </div>
          );
        },
        cellClass: "w-max-content",
      },
      {
        key: "total",
        name: "Total Travel",
        sortable: true,
        headerCellClass: headerClass,
        renderHeaderCell: (props) => {
          return (
            <Button variant="ghost" className="w-full">
              Total Travel
              {props.sortDirection === "ASC" ? (
                <CaretUpIcon className="ml-2 h-4 w-4" />
              ) : props.sortDirection === "DESC" ? (
                <CaretDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        renderCell: (props) => {
          return (
            <div className="text-center">
              {props.row.spec.travel.total
                ? formatTravel(props.row.spec.travel.total)
                : "—"}
            </div>
          );
        },
      },
    ];

    return data;
  }, [selectedSwitchTypes]);

  const search = form.watch("search");

  const filteredRows = useMemo((): readonly Row[] => {
    let filterRows = [...rows];

    const fuse = new Fuse(rows, {
      keys: [
        "friendlyName",
        "spec.type",
        "spec.force.actuation.value",
        "spec.force.tactile.value",
        "spec.force.bottom.value",
        "spec.travel.pre.value",
        "spec.travel.total.value",
      ],
    });

    if (search) {
      filterRows = fuse.search(search).map((result) => result.item);
    }

    return filterRows;
  }, [rows, selectedSwitchTypes, search]);

  const sortedRows = useMemo((): readonly Row[] => {
    if (sortColumns.length === 0) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === "ASC" ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [filteredRows, sortColumns]);

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold">Switches Table</h1>
        <Form {...form}>
          <form className="space-y-6 mt-2">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Search for switches, sizes, materials..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="relative overflow-scroll mb-12 mt-4 w-full">
        <DataGrid
          className="w-full h-full bg-transparent text-foreground"
          rowClass={(_, i) => {
            let baseStyle = "bg-transparent outline-none hover:bg-muted";
            if (i % 2 === 0) {
              baseStyle += " bg-secondary/10 dark:bg-secondary/30";
            }
            return baseStyle;
          }}
          ref={gridRef}
          rowKeyGetter={rowKeyGetter}
          columns={columns}
          rows={sortedRows}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
            // width: "max-content",
          }}
          onRowsChange={setRows}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          enableVirtualization={!isExporting}
        />
      </div>
    </>
  );
}
