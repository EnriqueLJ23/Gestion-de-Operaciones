'use server'
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache";
export const deleteCI = async (id) => {
    
    if (!id) {
        throw new Error("valiste verga, mi buen.");
    }
    try {
        await prisma.elementos.delete(
            {
                where: {id: id}
            }
        )
        revalidatePath("/configuraciones")
        return { message: "CI eliminado correctamente" }
    } catch (error) {
        console.log(error);
        
        throw new Error("valiste verga, mi buen.");
        
    }
}