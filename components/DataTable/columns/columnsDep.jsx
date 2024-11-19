 'use client'
import DeleteDialog from "@/components/DeleteDialog";
import UpdateDialog from "@/components/UpdateDialog";
import { deleteDepartamento } from "@/app/actions/departamentos";
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
    accessorKey: "encargado",
    header: "Jefe de Departamento",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const data = row.original

      return(
        <div className="flex">
        <UpdateDialog />
      <DeleteDialog data={data} deleteTh={deleteDepartamento}/>
        </div>
    )
    }},

]

export default columns