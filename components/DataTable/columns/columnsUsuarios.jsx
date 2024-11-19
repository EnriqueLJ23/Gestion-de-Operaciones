'use client'

import { Button } from "@/components/ui/button"
import { Search, Plus, Edit, Trash } from 'lucide-react';
 const columns = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
  },
  {
    accessorKey: "rol",
    header: "Rol",
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const data = row.original

      return (
    
        <>
         <Button  className="mr-2">
                    <Edit size={16} />
                  </Button>
                  <Button variant="destructive">
                    <Trash size={16} />
                  </Button>
        </>

        
      )
    },
  },

]

export default columns