"use client"
import { RocketIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
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
import { useState, useEffect } from "react"
import { addComputadora, addProyector } from "@/app/actions/departamentos"
import { PlusCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
// Zod schema validation
const FormSchema = z.object({
    fecha: z.date({ required_error: "requerido" }),
    marca: z.string({ required_error: "requerido" }).min(2, { message: "¿Cual es tu plan?" }),
    modelo: z.string({ required_error: "requerido" }).min(2, { message: "¿Cual es tu plan?" }),
    horas: z
        .string()
        .min(1, { message: "requerido" })  
        .transform((val) => Number(val))   
        .refine((val) => !isNaN(val), { message: "Debe ser un número válido" }) 
})

export function ProyectorForm() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast()

    const defaultValues = {
        fecha: undefined,
        marca: undefined,
        modelo: undefined,
        horas: undefined
    }

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues,
    })
    const resetForm = () => {
        form.reset(defaultValues);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    async function onSubmit(data) {
        try {
            data.almacenamiento = data.almacenamiento +" "+ data.tipodisco
            const result = await addProyector(data)
            toast({
                title: "Hoy brindare por ti!",
                description: result.message,
                variant: "positive",
            });
            setOpen(false); 
        } catch (error) {
            toast({
                variant: "destructive",
                description: error.message || "Error en la creación del Departamento",
                title: "Error",
            });
            console.log(error.message);
            
        } finally {
    
        }
    }


    return (
  
                <Form {...form} asChild >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    



            {/* Seleccionar fecha */}
                    <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Compra</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P")
                      ) : (
                        <span>Elije una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
                        
                        {/* Input para Marca */}
                        <FormField
                            control={form.control}
                            name="marca"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marca:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Introduce el nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Input para Modelo */}
                        <FormField
                            control={form.control}
                            name="modelo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modelo:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Introduce el modelo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                       {/* Input para Marca */}
                       <FormField
                            control={form.control}
                            name="horas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Horas de uso:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Introduce algo, loco." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between">
                        <Button type="button" onClick={() => setOpen(false)} className="" variant="outline">Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </div>
                    </form>
                </Form>

    )
}
