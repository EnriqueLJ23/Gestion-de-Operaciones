"use client"
import { createDepartamento } from "@/app/actions/departamentos"
import { RocketIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

// Zod schema validation
const FormSchema = z.object({
    nombre: z.string({ required_error: "El nombre es requerido" }).min(2, { message: "DanDaDan" }),
    encargado: z.string({ required_error: "Selecciona Jefe de Departamento" }),
})

export function DepartamentoForm({ usus }) {
    const [variant, setVariant] = useState("")
    const [message, setMessage] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [showF, setShowF] = useState(false)

    const fUsus = usus.map((usu) => ({
        value: usu.id,
        label: usu.nombre,
    }))

    const form = useForm({
        resolver: zodResolver(FormSchema),
    })

    async function onSubmit(data) {
        try {
            const result = await createDepartamento(data)
            setVariant("positive")
            setMessage(result.message || "Departamento creado exitosamente.")
            setShowMessage(true)
        } catch (error) {
            setVariant("destructive")
            setMessage(error.message || "Error en la creación del Departamento")
            setShowMessage(true)
        } finally {
            setTimeout(() => {
                setShowMessage(false)
                setShowF(!showF)
            }, 2000)
        }
    }

    return (
        <>
       
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Input field for "departamentos" */}
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Introduce el nombre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Select field for fDep */}
                            <FormField
                                control={form.control}
                                name="encargado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jefe de Departamento</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un usuario" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fUsus.map((usu) => (
                                                        <SelectItem key={usu.value} value={usu.value.toString()}>
                                                            {usu.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between">
                            <Button onClick={()=> setShowF(!showF)} className="" variant="outline"  >Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                            </div>
                        </form>
                    </Form>
      
             </>

    )
}
