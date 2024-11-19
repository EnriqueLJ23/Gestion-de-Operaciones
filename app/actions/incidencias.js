'use server'
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createReporte = async (data, session) => {
  console.log("Creating report with data:", data);
  
  try {
    // Get the service details to set up SLA times
    const service = await prisma.servicio.findUnique({
      where: {
        id: parseInt(data.servicio)
      }
    });

    if (!service) {
      throw new Error("Servicio no encontrado");
    }

    // Calculate response and resolution deadlines based on service SLAs
    const fechadecreacion = new Date();
    const fecha_limite_respuesta = new Date(fechadecreacion.getTime() + service.tiempo_respuesta * 60000); // Convert minutes to milliseconds
    const fecha_limite_resolucion = new Date(fechadecreacion.getTime() + service.tiempo_resolucion * 60000);

    const nuevoReporte = await prisma.reportes.create({
      data: {
        aula: {
          connect: {
            id: parseInt(data.aula)
          }
        },
        elemento: {
          connect: {
            id: parseInt(data.elemento)
          }
        },
        servicio: {
          connect: {
            id: parseInt(data.servicio)
          }
        },
        descripcion: data.descripcion,
        creador: {
          connect: {
            id: parseInt(session)
          }
        },
        prioridad: service.nivel_prioridad.toLowerCase(),
        fechadecreacion: fechadecreacion,
        fecha_limite_respuesta: fecha_limite_respuesta,
        fecha_limite_resolucion: fecha_limite_resolucion,
        estado: "Pendiente"
      },
    });
    
    revalidatePath("/incidencias");
    return { success: true, reporte: nuevoReporte };
   
  } catch (error) {
    console.error("Error al crear reporte:", error);
    return { 
      success: false, 
      error: error.message || "No se pudo crear el reporte" 
    };
  }
}

export const updateReporte = async (data) => {
  const { incidenteId, tecnicoAsignadoId, servicioId, categoria, prioridad } = data;

  try {
    const updateData = {
      tecnicoasignado: {
        connect: {
          id: parseInt(tecnicoAsignadoId)
        }
      }
    };

    // If service ID is provided, include it in the update
    if (servicioId) {
      const service = await prisma.servicio.findUnique({
        where: {
          id: parseInt(servicioId)
        }
      });

      if (!service) {
        throw new Error("Servicio no encontrado");
      }

      // Calculate new SLA deadlines based on the updated service
      const fecha_actualizacion = new Date();
      updateData.servicio = {
        connect: {
          id: parseInt(servicioId)
        }
      };
      updateData.fecha_limite_respuesta = new Date(fecha_actualizacion.getTime() + service.tiempo_respuesta * 60000);
      updateData.fecha_limite_resolucion = new Date(fecha_actualizacion.getTime() + service.tiempo_resolucion * 60000);
      updateData.prioridad = prioridad || service.nivel_prioridad.toLowerCase();
      updateData.categoria = categoria;
      updateData.estado = "Asignado";

    }

    // Update the report with new data
    const updatedReporte = await prisma.reportes.update({
      where: {
        id: parseInt(incidenteId)
      },
      data: updateData,
    });

    revalidatePath(`/incidencias/${incidenteId}`);
    return { success: true, reporte: updatedReporte };
  } catch (error) {
    console.error("Error al actualizar reporte:", error);
    return { success: false, error: error.message || "No se pudo actualizar el reporte" };
  }
};


export async function updateIncident({
  id,
  estado,
  resolucion,
  requiresChange
}) {
  try {
    const updatedIncident = await prisma.reportes.update({
      where: { id },
      data: {
        estado: "Resuelto",
        solucion: resolucion,
        requiere_cambios: requiresChange,
        fecha_resolucion: new Date()
      }
    })

    revalidatePath('/incidencias')
    return { success: true, data: updatedIncident }
  } catch (error) {
    console.error('Error updating incident:', error)
    return { success: false, error: 'Failed to update incident' }
  }
}



// Acción para cuando el técnico comienza a atender la incidencia
export async function attendIncident(incidentId) {
  try {
    const updatedIncident = await prisma.reportes.update({
      where: { id: parseInt(incidentId) },
      data: {
        estado: "En Diagnostico",
      }
    });
    
    revalidatePath(`/incidencias/${incidentId}`);
    return { success: true, data: updatedIncident };
  } catch (error) {
    console.error('Error attending incident:', error);
    return { success: false, error: 'No se pudo actualizar el estado de la incidencia' };
  }
}
// Acción actualizada para registrar diagnóstico y crear cambio si es necesario
export async function registerDiagnosis({
  incidentId,
  diagnosis,
  requiresChange,
  workOrderData = null // Nuevo parámetro para datos de la orden de trabajo
}) {
  try {
    // Usar transacción para asegurar que ambas operaciones se completen o ninguna
    const result = await prisma.$transaction(async (prisma) => {
      // Primero actualizamos el reporte con el diagnóstico
      const updatedIncident = await prisma.reportes.update({
        where: { id: parseInt(incidentId) },
        data: {
          estado: requiresChange ? "Esperando Confirmacion" : "En Proceso",
          diagnostico: diagnosis,
          requiere_cambios: requiresChange
        }
      });

      // Si requiere cambios y se proporcionaron los datos de la orden de trabajo
      if (requiresChange && workOrderData) {
        const workOrder = await prisma.cambios.create({
          data: {
            titulo: workOrderData.titulo || `Cambio requerido para incidente #${incidentId}`,
            descripcion: workOrderData.descripcion,
            prioridad: workOrderData.prioridad || "Media",
            impacto: workOrderData.impacto || "Medio",
            estado: "Pendiente",
            fechaCreacion: new Date(),
            analisisImpacto: workOrderData.analisisImpacto || "",
            analisisRiesgo: workOrderData.analisisRiesgo || "",
            planRollback: workOrderData.planRollback || "",
            // Conexiones con otras tablas
            reporte: {
              connect: { id: parseInt(incidentId) }
            },
            componente_catalogo: {
              connect: { id: parseInt(workOrderData.componenteid) }
            },
            solicitante: {
              connect: { id: parseInt(workOrderData.solicitanteId) }
            },
            // Conectar con el elemento afectado si existe
            ...(workOrderData.elementoId && {
              elemento: {
                connect: { id: parseInt(workOrderData.elementoId) }
              }
            })
          }
        });

        return { updatedIncident, workOrder };
      }

      return { updatedIncident };
    });

    revalidatePath(`/incidencias/${incidentId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error en registro de diagnóstico:', error);
    return { 
      success: false, 
      error: 'No se pudo registrar el diagnóstico y/o crear la orden de cambio' 
    };
  }
}

// Acción para crear una orden de trabajo
export async function createWorkOrder({
  incidentId,
  type,
  description,
  implementadorId
}) {
  try {
    // Comenzar una transacción para asegurar consistencia
    const result = await prisma.$transaction(async (prisma) => {
      // Crear la orden de trabajo
      const workOrder = await prisma.cambios.create({
        data: {
          titulo: `Cambio requerido para incidente #${incidentId}`,
          descripcion: description,
          tipo: type,
          estado: "Pendiente",
          prioridad: "Media", // Esto podría ser dinámico basado en la incidencia
          impacto: "Medio",
          reporte: {
            connect: { id: parseInt(incidentId) }
          },
          implementador: {
            connect: { id: parseInt(implementadorId) }
          }
        }
      });

      // Actualizar el estado de la incidencia
      const updatedIncident = await prisma.reportes.update({
        where: { id: parseInt(incidentId) },
        data: {
          estado: "Esperando Confirmación"
        }
      });

      return { workOrder, updatedIncident };
    });

    revalidatePath(`/incidencias/${incidentId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating work order:', error);
    return { success: false, error: 'No se pudo crear la orden de trabajo' };
  }
}


export async function registerSolution({
  incidentId,
  solution,
  userId
}) {
  try {
    // Primero obtenemos el reporte con su información de cambios
    const report = await prisma.reportes.findFirst({
      where: { id: incidentId },
      include: {
        cambios: true,
        elemento: true
      }
    });

    if (!report) {
      throw new Error("Reporte no encontrado");
    }

    // Iniciamos una transacción para asegurar la consistencia de los datos
    const result = await prisma.$transaction(async (tx) => {
      // 1. Actualizamos el reporte
      const updatedReport = await tx.reportes.update({
        where: { id: incidentId },
        data: {
          solucion: solution,
          estado: "Resuelto",
          fecha_resolucion: new Date()
        }
      });

      // 2. Si hay orden de trabajo (cambios), actualizamos esas tablas
      if (report.cambios && report.cambios.length > 0) {
        const workOrder = report.cambios[0]; // Asumimos que solo hay una orden de trabajo por reporte

        // Actualizamos la orden de trabajo
        await tx.cambios.update({
          where: { id: workOrder.id },
          data: {
            estado: "Completado",
            fechaCierre: new Date(),
            implementadorid: userId,
            fechaImplementacion: new Date(),
            resultadoImplementacion: solution
          }
        });

        // Actualizamos el elemento afectado
        if (report.elemento) {
          await tx.elementos.update({
            where: { id: report.elemento.id },
            data: {
              fechadeultimocambio: new Date(),
              autorultimocambioid: userId
            }
          });
        }
      }

      return updatedReport;
    });


    revalidatePath("/cambios")
    revalidatePath("/incidencias")
    revalidatePath(`/incidencias/${incidentId}`);
    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error("Error al registrar la solución:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Acción para actualizar el estado de la incidencia
export async function updateIncidentStatus({
  incidentId,
  status
}) {
  try {
    const updatedIncident = await prisma.reportes.update({
      where: { id: parseInt(incidentId) },
      data: {
        estado: status
      }
    });

    revalidatePath(`/incidencias/${incidentId}`);
    return { success: true, data: updatedIncident };
  } catch (error) {
    console.error('Error updating incident status:', error);
    return { success: false, error: 'No se pudo actualizar el estado' };
  }
}


export async function createEvaluacion(formData) {
  console.log(formData);
  
  try {
    const reporteId = parseInt(formData.get('reporteId') )
    const calificacionTecnico = parseInt(formData.get('calificacion_tecnico') )
    const tiempoRespuesta = parseInt(formData.get('tiempo_respuesta') )
    const comentarios = formData.get('comentarios') 

    // Obtener el reporte para verificar el técnico asignado
    const reporte = await prisma.reportes.findUnique({
      where: { id: reporteId },
      select: { tecnicoasignadoid: true }
    })

    if (!reporte || !reporte.tecnicoasignadoid) {
      throw new Error('Reporte no encontrado o sin técnico asignado')
    }

    // Calcular puntuación total
    const puntuacionTotal = (calificacionTecnico + tiempoRespuesta) / 2

    // Crear la evaluación
    const evaluacion = await prisma.evaluacion_tecnico.create({
      data: {
        reporteid: reporteId,
        tecnicoid: reporte.tecnicoasignadoid,
        calificacion_tecnico: calificacionTecnico,
        tiempo_respuesta: tiempoRespuesta,
        comentarios: comentarios,
        puntuacion_total: puntuacionTotal
      }
    })

    await prisma.reportes.update({
      where:{id: reporteId},
      data: {
        estado: "Liberado"
      }
    
    })

    revalidatePath(`/incidencias/${reporteId}`)
    revalidatePath(`/incidencias`)
    return { success: true, data: evaluacion }
  } catch (error) {
    console.error('Error al crear evaluación:', error)
    return { success: false, error: 'Error al procesar la evaluación' }
  }
}


// Acción para actualizar el estado de la incidencia
export async function updateCambio(data) {
  try {
    const updatedCambio = await prisma.cambios.update({
      where: { id: parseInt(data.cambioId) },
      data: {
        estado: data.status
      }

      
    });

    await prisma.reportes.update({
      where: { id: parseInt(data.incidenciaId) },
      data: {
        estado: data.status === 'Autorizado' ? 'En Proceso' : 'Cancelado'
    }
    });
    revalidatePath(`/cambios`);
    revalidatePath(`/incidencias`);
    return { success: true, data: updatedCambio };
  } catch (error) {
    console.error('Error updating incident status:', error);
    return { success: false, error: 'No se pudo actualizar el estado' };
  }
}
