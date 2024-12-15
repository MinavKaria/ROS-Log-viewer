import { ColumnDef } from "@tanstack/react-table"

export type Log = {
  timestamp: string
  severity: string
  node: string
  message: string
}

export const columns: ColumnDef<Log>[] = [
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
