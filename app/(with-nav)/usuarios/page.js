import columns from "@/components/DataTable/columns/columnsUsuarios";
import { DataTable } from "@/components/DataTable/DataTable";
import FormUsuarios from "./FormU";
import prisma from "@/lib/db";
import { Search, Plus, Edit, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UserManagement from "@/components/UsuariosInter";

export default async function Home() {
  const usuarios = await prisma.usuarios.findMany({
    include: {
      rol: {
        select: { nombre: true}
      },
      departamento: {
        select: {
          nombre: true,
        },
      },
    },
  });
const departamentos = await prisma.departamento.findMany()

  console.log(usuarios);
  const flatUsu = usuarios.map(({ departamento,rol,especialidad, ...rest }) => ({
    ...rest,  
    departamento: departamento?.nombre || 'N/A', 
    rol: rol?.nombre || 'N/A', 
    especialidad: especialidad || 'N/A', 

  }));

  console.log("USUARIOS LOCO",flatUsu);
  
  return (
    <>
      <UserManagement usuarios={flatUsu} departamentos={departamentos}/>
    </>
  );
}
