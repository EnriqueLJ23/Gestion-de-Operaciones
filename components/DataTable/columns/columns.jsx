'use client'
import DataTableColumnHeader from "@/components/DataTable/columns/ColumnHeader";

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"




import { Button } from "@/components/ui/button"

const priorities = [
  {
    label: "Baja",
    value: "baja",
    icon: ArrowDownIcon,
  },
  {
    label: "Media",
    value: "media",
    icon: ArrowRightIcon,
  },
  {
    label: "Alta",
    value: "alta",
    icon: ArrowUpIcon,
  },
]

export const columns = [
  
  {
    accessorKey: "ubicacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ubicacion" />
    ),
  },
  {
    accessorKey: "descripcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripcion" />
    ),
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
  },
  {
    accessorKey: "tecnicoNombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tecnico" />
    ),
  },
  {
    accessorKey: "prioridad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridad" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === (row.getValue("prioridad")).toLowerCase()
      )

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "fechadecreacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Creacion" />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <Button row={row}>Modificar</Button>,
  },
];