import { format } from 'date-fns';

import prisma
 from "@/lib/db";

import CIManagement from '@/components/Configuraciones/CiElements';
export default async function Home() {
  const elementos = await prisma.elementos.findMany({
    include: {
      aula: {
        select: {
          nombre: true, // Solo obtener el nombre del aula
        },
      },
      autorultimocambio: {
        select: {
          nombre: true, // Solo obtener el nombre del usuario
        },
      },
    },
  });
console.log("ELEMENTOS DE CI",elementos);


  const flatC = elementos.map(({ autordeultimocambio,aula,fechadecompra, fechadeultimocambio, ...rest }) => ({
    ...rest,  
    autordeultimocambio: autordeultimocambio?.nombre || 'No Asignado', 
    aula: aula?.nombre || 'No Asignado', 
    fechadecompra: format(new Date(fechadecompra), 'yyyy-MM-dd'),
    fechadeultimocambio: fechadeultimocambio ? format(new Date(fechadeultimocambio), 'yyyy-MM-dd') : 'N/A',
  }));
console.log("FKAT ",flatC);

  return (
    <>
    <CIManagement data={flatC} />
    
    </>
    
  );
}
