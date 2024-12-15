"use client"

import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import * as XLSX from 'xlsx'

interface Log {
  timestamp: string | number | symbol
  level: string | number | symbol
  node: string | number | symbol
  message: string | number | symbol
}

export const logColumns: ColumnDef<Log>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "level",
    header: "Severity",
  },
  {
    accessorKey: "node",
    header: "Node",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
]

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  const severityLevels = Array.from(new Set(
    (data as Log[]).map(item => item.level)
  )).sort()

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  })


  const exportToExcel = () => {
    const filteredData = table.getFilteredRowModel().rows.map(row => 
      columns.reduce((obj, column) => {
        // @ts-ignore
        const accessorKey = column.accessorKey as keyof TData
        // @ts-ignore
        const value = row.getValue(accessorKey)
        

        obj[column.header as string] = value !== undefined 
          ? String(value)  
          : ''
        
        return obj
      }, {} as Record<string, string>)
    )
  
    const worksheet = XLSX.utils.json_to_sheet(filteredData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs")
    XLSX.writeFile(workbook, "filtered_logs.xlsx")
  }

  return (
    <div className="rounded-md border mt-20 p-5">
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Search by message"
          value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("message")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
        <Select
          value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => 
            table.getColumn("level")?.setFilterValue(value === "All" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Severities</SelectItem>
            {severityLevels.map(level => (
              <SelectItem key={String(level)} value={String(level)}>{String(level)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={exportToExcel} variant="outline">
          Export to Excel
        </Button>
      </div>
      
      <div className="">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left px-4 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const level = row.getValue("level")
                    let severityClass = ""
                    if (level === "ERROR") {
                      severityClass = "text-red-500"
                    } else if (level === "WARN") {
                      severityClass = "text-yellow-500"
                    }
                    return (
                      <TableCell
                        key={cell.id}
                        className={`px-4 py-2 text-left ${severityClass}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}