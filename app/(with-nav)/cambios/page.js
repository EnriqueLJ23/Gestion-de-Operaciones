import ChangeManagementDashboard from "@/components/CambiosInter";
import prisma from "@/lib/db";

export default async function Home() {
  const cambios = await prisma.cambios.findMany({
    include: {
      solicitante: {
        select: {nombre: true}
      },
      elemento: {
        include: {
          autorultimocambio: {
            select: { nombre: true } // Incluye el nombre del autor del último cambio
          }
        }
      },
      componente_catalogo: {
        select: {nombre: true, precio: true}
      }
    }
  });
  console.log(cambios);
  
  return (
    <div className="">
      <ChangeManagementDashboard cambios={cambios}/>
    </div>
  );
}
