'use server'
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache";

export async function createUsuario(data) {
    const { nombre, rol, especialidad, departamento } = data
  
    if (!nombre) {
      throw new Error("El nombre del usuario es obligatorio.")
    }
  
    try {
      await prisma.usuarios.create({
        data: {
          nombre,
          especialidad,
          departamento: {
              connect: { id: parseInt(departamento) },
            },
          rol: {
                connect: { id: parseInt(rol) },
              },
        },
      })
  
      revalidatePath('/usuarios')
      return { message: "usuario creado exitosamente." }
    } catch (error) {
      console.error("Error al crear el usuario:", error)
      throw new Error(error.message || "Error al crear el usuario.")
    }
  }