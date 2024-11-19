import InfrastructureManager from "@/components/InfraUI"
import prisma from "@/lib/db";

export default async function InfraestructuraPage() {
  const departamentos = await prisma.departamento.findMany({
    include: {
      encargado: {
        select: {
          nombre: true, 
        },
      },
      edificio: {
        select: {
          nombre: true, 
        },
      },
    },
  });
  const edificios = await prisma.edificio.findMany({
    include: {
      encargado: {
        select: {
          nombre: true, 
        },
      },
      departamento: {
        select: {
          nombre: true, 
        },
      },
      aula: {
        select: {
          nombre: true, 
        },
      },
    },
  });

  const aulas = await prisma.aula.findMany({
    include: {
      responsable: {
        select: {
          nombre: true,
        },
      },
      edificio: {
        select: { 
          nombre: true, 
          departamento: { 
            select: { nombre: true },
          },
        },
      },
      elementos: { // Include elementos
        select: {
          id: true,
          custom_id: true,
        },
      },
    },
  });
  const usuarios = await prisma.usuarios.findMany();
const elementos = await prisma.elementos.findMany();

  const flatAu = aulas.map(({ edificio, responsable,...rest }) => ({
    ...rest,
    edificio: edificio?.nombre || 'N/A',
    departamento: edificio?.departamento?.nombre || 'N/A',
    responsable: responsable?.nombre || 'N/A',
  }));

  const flatEd = edificios.map(({ encargado,departamento, ...rest }) => ({
    ...rest,  
    encargado: encargado?.nombre || 'No Asignado', 
    departamento: departamento?.nombre || 'No Asignado', 
  }));
  
  const flatDeps = departamentos.map(({ encargado, ...rest }) => ({
    ...rest,  
    encargado: encargado?.nombre || 'No Asignado', 
  }));

 
    return (
      <>
       <InfrastructureManager departamentos={flatDeps} edificios={flatEd} aulas={flatAu} usus={usuarios} elementos={elementos}/>
      </>
      
    )
  }