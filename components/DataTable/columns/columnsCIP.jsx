'use client'
import { Button } from "@/components/ui/button"
import { Edit, Trash } from 'lucide-react';
 const columns = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "fechadecompra",
    header: "Fecha de compra",
  },
  {
    accessorKey: "aula",
    header: "Aula",
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
    accessorKey: "horasdeuso",
    header: "Horas de Uso",
  },
  {
    accessorKey: "fechadeultimocambio",
    header: "Fecha de ultimo cambio",
  }, 
  {
    accessorKey: "autorultimocambio",
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