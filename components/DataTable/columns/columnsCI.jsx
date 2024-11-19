'use client'
import DataTableColumnHeader from "./ColumnHeader";
import { Button } from "@/components/ui/button"
import { Edit, Trash } from 'lucide-react';
 const columns = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "fechadecompra",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Compra" />
    ),
  },
  {
    accessorKey: "aula",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aula" />
    ),
  },
  {
    accessorKey: "marca",
    header: "Marca",
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
  },
  {
    accessorKey: "cpu",
    header: "cpu",
  },
  {
    accessorKey: "ram",
    header: "Ram",
  },
  {
    accessorKey: "almacenamiento",
    header: "Almacenamiento",
  },
  {
    accessorKey: "sistemaoperativo",
    header: "Sistema Operativo",
  },
  {
    accessorKey: "fechadeultimocambio",
    header: "Fecha de ultimo cambio",
  }, 
  {
    accessorKey: "autordeultimocambio",
    header: "Autor de ultimo cambio",
  },
  
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const data = row.original

      return (
        <>
          <Button  className="mr-2">
                    <Edit size={16} />
                  </Button>
                  <Button  variant="destructive">
                    <Trash size={16} />
                  </Button>
        </>
      )
    },
  },

]

export default columns