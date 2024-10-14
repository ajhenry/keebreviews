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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
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
    case "friendlyName":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}

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

  const columns = useMemo(() => {
    const data: Column<Row, SummaryRow>[] = [
      {
        key: "friendlyName",
        name: "Name",
        frozen: false,
        resizable: true,
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
      },
      {
        key: "type",
        name: "Type",
        sortable: false,
        renderHeaderCell: (props) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  // onClick={() =>
                  //   column.toggleSorting(column.getIsSorted() === "asc")
                  // }
                >
                  Type
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Type</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the dimensions for the layer.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {["linear", "tactile", "clicky"].map((switchType) => {
                      return (
                        <div className="items-top flex space-x-2">
                          <Checkbox
                            id={switchType}
                            checked={selectedSwitchTypes.includes(switchType)}
                            onCheckedChange={(checked) => {
                              console.log(selectedSwitchTypes);
                              if (checked) {
                                setSelectedSwitchTypes([
                                  ...selectedSwitchTypes,
                                  switchType,
                                ]);
                              } else {
                                setSelectedSwitchTypes(
                                  selectedSwitchTypes.filter(
                                    (type) => type !== switchType
                                  )
                                );
                              }
                            }}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={switchType}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                            >
                              {switchType}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
      },
      {
        key: "review",
        name: "Score",
        sortable: true,
        renderHeaderCell: (props) => {
          return "Score";
        },
        renderCell: (props) => {
          return <div>100</div>;
        },
      },
    ];

    return data;
  }, [selectedSwitchTypes]);

  const filteredRows = useMemo((): readonly Row[] => {
    let filterRows = [...rows];

    if (selectedSwitchTypes.length > 0) {
      filterRows = filterRows.filter((row) =>
        selectedSwitchTypes.includes(row.spec.type)
      );
    }

    return filterRows;
  }, [rows, selectedSwitchTypes]);

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
    <div className="w-full">
      <DataGrid
        className="w-full h-full"
        ref={gridRef}
        rowKeyGetter={rowKeyGetter}
        columns={columns}
        rows={sortedRows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        onRowsChange={setRows}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
        enableVirtualization={!isExporting}
      />
    </div>
  );
}
