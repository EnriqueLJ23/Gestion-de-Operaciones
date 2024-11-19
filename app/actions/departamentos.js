'use server'
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache";

export async function createDepartamento(formData) {
    const { nombre, encargado } = formData
  
    if (!nombre) {
      throw new Error("El nombre del Departamento es obligatorio.")
    }
  
    let encargadoId = encargado ? parseInt(encargado) : null
  
    try {
      await prisma.departamento.create({
        data: {
          nombre,
          ...(encargadoId && {
            encargado: {
              connect: { id: encargadoId },
            },
          }),
        },
      })
  
      revalidatePath('/infraestructura/departamentos')
      return { message: "Departamento creado exitosamente." }
    } catch (error) {
      console.error("Error al crear el departamento:", error)
      throw new Error(error.message || "Error al crear el Departamento.")
    }
  }

export const addEdificio = async(formData) => {
    const { nombre, departamento,encargado } = formData

    if (!nombre) {
        throw new Error("El nombre del edificio es obligatorio.");
    }
    if (!departamento) {
        throw new Error("El departamento es obligatorio.");
    }

    let encargadoId = encargado ? parseInt(encargado) : null;
    let departamentoId = departamento ? parseInt(departamento) : null;

    try {
        await prisma.edificio.create({
            data: {
                nombre,
                encargadoid: encargadoId,
                departamentoid: departamentoId,
            },
        });
        
        revalidatePath("/infraestructura/edificios")
        return { message: "Edificio creado exitosamente." }
    } catch (error) {
        throw new Error(error.message || "Error al crear el Edificio.")
    }
};

export async function addAula(data) {
  console.log("addAula called", data);
  const { nombre, edificio, responsable, cis } = data;

  try {
    // Iniciar una transacción
    const result = await prisma.$transaction(async (prisma) => {
      // Crear el aula
      const newAula = await prisma.aula.create({
        data: {
          nombre,
          edificioid: parseInt(edificio),
          responsableid: parseInt(responsable),
        },
      });

          // Actualizar los elementos con el nuevo aulaid
          for (const ci of cis) {
            await prisma.elementos.update({
              where: { id: parseInt(ci.aparatoId) },
              data: { aulaid: newAula.id },
            });
          }
    
          return newAula;
        });

    console.log(result);
    
    revalidatePath("/infraestructura")
    return { message: "Aula creada exitosamente." }
  } catch (error) {
    console.error('Error al añadir el aula:', error);
    return { success: false, error: error.message };
  }
}

export const addComputadora = async(formData) => {
  const { fecha, marca, modelo, tipo, cpu, ram, almacenamiento, sistema, software  } = formData

  if (!fecha) {
      throw new Error("El nombre del edificio es obligatorio.");
  }
  let rams = ram ? parseInt(ram) : null;

  try {
      const newCom = await prisma.elementos.create({
          data: {
            fechadecompra: fecha,
            marca,
            modelo,
            element_type: "computadora",
            cpu,
            ram: rams,
            almacenamiento,
            softwareinstalado: software,
            sistemaoperativo: sistema,
            custom_id: "TEMP_ID_PC"
          },
        });
        await prisma.elementos.update({
          where: {id: newCom.id},
          data: {custom_id: `PC0${newCom.id}`}

        })

      revalidatePath("/configuraciones")
      return { message: "Computadora creada exitosamente." }
      
  } catch (error) {
      throw new Error(error.message || "Error al crear el Aula.")
  }
};

export const addProyector = async(formData) => {
  const { fecha, marca, modelo, horas} = formData

  if (!fecha) {
      throw new Error("Pongale fecha, verga.");
  }


  try {
      const newPro = await prisma.elementos.create({
          data: {
            fechadecompra: fecha,
            marca,
            modelo,
            horasdeuso: horas,
            element_type: "proyector",
            custom_id: "TEMP_ID"
          },
        });
        await prisma.elementos.update({
          where: {id: newPro.id},
          data: {custom_id: `PR0${newPro.id}`}

        })
      revalidatePath("/configuraciones")
      return { message: "Proyector creado exitosamente." }
      
  } catch (error) {
      throw new Error(error.message || "Error al crear el Aula.")
  }
};


export const addImpresora = async(formData) => {
  const { fecha, marca, modelo, hojas, tinta} = formData

  if (!fecha) {
      throw new Error("El nombre del edificio es obligatorio.");
  }


  try {
      const newImp = await prisma.elementos.create({
          data: {
            fechadecompra: fecha,
            marca,
            modelo,
            hojasimpresas: hojas,
            niveldetinta: tinta,
            element_type: "impresora",
            custom_id: "TEMP_ID"

          },
        });
        await prisma.elementos.update({
          where: {id: newImp.id},
          data: {custom_id: `IM0${newImp.id}`}

        })
      revalidatePath("/configuraciones")
      return { message: "Impresora creada exitosamente." }
      
  } catch (error) {
      throw new Error(error.message || "Error al crear la impresora.")
  }
};

export const deleteDepartamento = async(id) => {
  if (!id) {
    throw new Error("El id del departamento es obligatoria.");
  }

  try {
    // Primero obtenemos todos los edificios del departamento
    const edificios = await prisma.edificio.findMany({
      where: {
        departamentoid: parseInt(id)
      }
    });

    // Para cada edificio, eliminamos sus aulas y elementos relacionados
    for (const edificio of edificios) {
      // Obtenemos todas las aulas del edificio
      const aulas = await prisma.aula.findMany({
        where: {
          edificioid: edificio.id
        }
      });

      // Para cada aula, eliminamos sus elementos relacionados
      for (const aula of aulas) {
        // Eliminamos computadoras, proyectores e impresoras
        await prisma.elementos.deleteMany({
          where: {
            aulaid: aula.id
          }
        });

        // Eliminamos el aula
        await prisma.aula.delete({
          where: {
            id: aula.id
          }
        });
      }

      // Eliminamos el edificio
      await prisma.edificio.delete({
        where: {
          id: edificio.id
        }
      });
    }

    // Actualizamos los usuarios que pertenecían al departamento
    await prisma.usuarios.updateMany({
      where: {
        departamentoid: parseInt(id)
      },
      data: {
        departamentoid: null
      }
    });

    // Finalmente eliminamos el departamento
    await prisma.departamento.delete({
      where: {
        id: parseInt(id)
      }
    });

    revalidatePath("/infraestructura");
    revalidatePath("/usuarios");
    return { message: "Departamento, edificios y aulas eliminados exitosamente." }
      
  } catch (error) {
    throw new Error(error.message || "Error al intentar borrar el departamento, intenta de nuevo.")
  }
};

export const deleteEdificio = async(id) => {
  if (!id) {
    throw new Error("El id del edificio es obligatoria.");
  }

  try {
    // Primero obtenemos todas las aulas del edificio
    const aulas = await prisma.aula.findMany({
      where: {
        edificioid: parseInt(id)
      }
    });

    // Para cada aula, actualizamos sus elementos relacionados y la eliminamos
    for (const aula of aulas) {
      // Actualizamos computadoras, proyectores e impresoras a null
      await prisma.elementos.deleteMany({
        where: {
          aulaid: aula.id
        }
      });

      // Eliminamos el aula
      await prisma.aula.delete({
        where: {
          id: aula.id
        }
      });
    }

    // Finalmente eliminamos el edificio
    await prisma.edificio.delete({
      where: {
        id: parseInt(id)
      }
    });

    revalidatePath("/infraestructura");
    revalidatePath("/usuarios");
    return { message: "Edificio y sus aulas eliminados exitosamente." }
      
  } catch (error) {
    throw new Error(error.message || "Error al intentar borrar el edificio, intenta de nuevo.")
  }
};

export const deleteAula = async(id) => {

  if (!id) {
      throw new Error("El id del aula es obligatoria.");
  }


  try {

    await prisma.elementos.updateMany({
      where: {
        aulaid: parseInt(id), 
      },
      data: {
        aulaid: null, 
      },
    });

    await prisma.aula.delete({
      where: {
        id: parseInt(id) ,
      },
    })

      revalidatePath("/infraestructura")
      revalidatePath("/configuraciones")
      return { message: "aula eliminada exitosamente." }
      
  } catch (error) {
      throw new Error(error.message || "Error al intentar borrar el aula, intenta de nuevo.")
  }
};