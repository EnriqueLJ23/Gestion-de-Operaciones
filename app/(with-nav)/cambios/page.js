import ChangeManagementDashboard from "@/components/Cambios/CambiosInter";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth()
  if (!session.user) return null


  let cambios = null;
  if(session.user.role === "tecnico"){
     cambios = await prisma.cambios.findMany({
      where: {solicitanteid: parseInt(session.user.id)},
      include: {
        solicitante: {
          select: {nombre: true}
        },
        elemento: {
          include: {
            autorultimocambio: {
              select: { nombre: true } 
            }
          }
        },
        componente_catalogo: {
          select: {nombre: true, precio: true}
        }
      }
    });
  } else {
    cambios = await prisma.cambios.findMany({
      include: {
        solicitante: {
          select: {nombre: true}
        },
        elemento: {
          include: {
            autorultimocambio: {
              select: { nombre: true } 
            }
          }
        },
        componente_catalogo: {
          select: {nombre: true, precio: true}
        }
      }
    });
  }

  
  console.log(cambios);
  
  return (
    <div className="">
      <ChangeManagementDashboard cambios={cambios}/>
    </div>
  );
}
