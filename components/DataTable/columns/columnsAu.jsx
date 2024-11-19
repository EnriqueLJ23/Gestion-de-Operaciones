'use client'

import { deleteAula } from "@/app/actions/departamentos";
import DeleteDialog from "@/components/DeleteDialog";
import { Button } from "@/components/ui/button"
import UpdateDialog from "@/components/UpdateDialog";
import { Edit, Trash } from 'lucide-react';
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
    accessorKey: "edificio",
    header: "Edificio",
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
  },
  {
    accessorKey: "responsable",
    header: "Responsable",
  },
  {
    accessorKey: "cis",
    header: "CIs",
    cell: ({ row }) => {
      const data = row.original;
      const devices = data.cis;
      return (
        <>
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <Button className="text-primary " key={index} variant="ghost">
             {device.custom_id}
            </Button>
          ))
        ) : (
          <span>No Devices</span>
        )}
      </>
      )
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const data = row.original
      console.log("THIS IS THE DAT",data);
      
      return(
        <div className="flex">
<UpdateDialog aulaData={data} />
<DeleteDialog data={data} deleteTh={deleteAula}/>
        </div>
      
      )
      
    },
  },

]

export default columns