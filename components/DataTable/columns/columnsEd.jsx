'use client'

import UpdateDialog from "@/components/UpdateDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { deleteEdificio } from "@/app/actions/departamentos";


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
    accessorKey: "encargado",
    header: "Encargado/Responsable",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const data = row.original

      return(
        <div className="flex">
        <UpdateDialog />
      <DeleteDialog data={data} deleteTh={deleteEdificio}/>
        </div>
      
      
    )
    },
  },

]

export default columns