import prisma from "@/lib/db"
import { auth } from "@/auth";
import { IncidenciaID } from "@/components/Incidentes/IncidenciaUnique";
import IncidenciasUniqueT from "@/components/Incidentes/IncidenciasUniqueT";
import IncidenciasUsuario from "@/components/Incidentes/IncidenciasUsuario";

export default async function Page({ params }) {
  const session = await auth()
  if (!session.user) return null

  const incidencia = await prisma.reportes.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      creador: {
        select: {
          nombre: true,
        },
      },
      servicio: {
        select: {
          nombre: true,
        },
      },
      elemento: {
        select: {
          custom_id: true,
          modelo: true,
          marca: true,
          element_type: true
        },
      },
      tecnicoasignado: {
        select: {
          nombre: true,
        },
      },
      aula: {
        select: {
          nombre: true,
          edificio: {
            select: {
              nombre: true,
              departamento: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      },
      cambios: {
        select: {
          id: true,
          titulo: true,
          descripcion: true,
          prioridad: true,
          estado: true,
          fechaCreacion: true,
        },
      },
    },
  });

  const servicio = await prisma.servicio.findMany()
  const tecnico = await prisma.usuarios.findMany({
    where: {
      rol: {
        nombre: 'tecnico'
      }
    }
  });

  const catalogo = await prisma.componente_catalogo.findMany({
    select: {nombre: true, categoria: true, id: true}
  })

  console.log(incidencia);
  
  if (session.user.role === "administrador" ) {
    return (
      <>
        <IncidenciaID incidencia={incidencia} servicio={servicio} tecnico={tecnico}/>
      </>
    )  
  }
  if (session.user.role === "tecnico" ) {
    return (
      <>
        <IncidenciasUniqueT incidente={incidencia} catalogo={catalogo} servicio={servicio} tecnico={tecnico}/>
      </>
    )  
  }

  return (
    <>
    <IncidenciasUsuario incidencia={incidencia} servicio={servicio} tecnico={tecnico}/>
  </>
  )

  }