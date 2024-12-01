import prisma from "@/lib/db";
import { auth } from "@/auth";
import IncidentManagement from "@/components/Incidentes/SampleInci";

export default async function Incidencias() {

  const session = await auth()
  if (!session.user) return null

  let incidencias = null;

  if(session.user.role === "usuario_normal"){
    incidencias = await prisma.reportes.findMany({
      where: {creadorid: parseInt(session.user.id)},
      include: {
        creador: {
          select: {
            nombre: true,
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
                    nombre: true
                  }
                }
              }
            }
          }
        },
        servicio: {
          select: {
            nombre: true,
          },
        },
        elemento: {
          select: {
            custom_id: true,
          },
        },
      },
    });  
  }
  if(session.user.role === "administrador"){
    incidencias = await prisma.reportes.findMany({
      include: {
        creador: {
          select: {
            nombre: true,
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
                    nombre: true
                  }
                }
              }
            }
          }
        },
        servicio: {
          select: {
            nombre: true,
          },
        },
        elemento: {
          select: {
            custom_id: true,
          },
        },
      },
    });  
  }
  if(session.user.role === "jefe_de_taller"){
    incidencias = await prisma.reportes.findMany({
      include: {
        creador: {
          select: {
            nombre: true,
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
                    nombre: true
                  }
                }
              }
            }
          }
        },
        servicio: {
          select: {
            nombre: true,
          },
        },
        elemento: {
          select: {
            custom_id: true,
          },
        },
      },
    });  
  }

  if(session.user.role === "tecnico"){
    incidencias = await prisma.reportes.findMany({
      where: {tecnicoasignadoid: parseInt(session.user.id)},
      include: {
        creador: {
          select: {
            nombre: true,
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
                    nombre: true
                  }
                }
              }
            }
          }
        },
        servicio: {
          select: {
            nombre: true,
          },
        },
        elemento: {
          select: {
            custom_id: true
          },
        },
      },
    });  
  }

  const departamento = await prisma.departamento.findMany()
  const edificio = await prisma.edificio.findMany()
  const aulas = await prisma.aula.findMany({})
  const elementos = await prisma.elementos.findMany({})
  const servicio = await prisma.servicio.findMany({
    include: {
      categoria: {
        select: {
          nombre: true,
        },
      },
    }
  })

  const flatIncidencias = incidencias.map(({ creador, tecnicoasignado, ...rest }) => ({
    ...rest,  
    usuarioNombre: creador?.nombre || 'No user', 
    tecnicoNombre: tecnicoasignado?.nombre || 'No Asignado',
    
  }));
console.log(incidencias);


  return (
    <>
      <IncidentManagement
      session={session.user.id}
      userRole={session.user.role}
      incidencias={flatIncidencias} 
      aulas={aulas}
      elementos={elementos}
      servicio={servicio}
      edificio={edificio}
      departamento={departamento}
       />
    </>
  );
}
