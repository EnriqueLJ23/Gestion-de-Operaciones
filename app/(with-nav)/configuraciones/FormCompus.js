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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { addComputadora } from "@/app/actions/departamentos"
import { Plus } from 'lucide-react'
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
    marca: z.string({ required_error: "requerido" }).min(2, { message: "9mm" }),
    modelo: z.string({ required_error: "requerido" }).min(2, { message: "9mm" }),
    cpu: z.string({ required_error: "requerido" }).min(2, { message: "9mm" }),
    almacenamiento: z.string({ required_error: "requerido" }).min(2, { message: "9mm" }),
    ram: z.string({ required_error: "requerido" }),
    tipo: z.string({ required_error: "requerido" }),
    tipodisco: z.string({ required_error: "Selecciona un tipo de disco" }),
    sistema: z.string({ required_error: "Selecciona un SO" }),
    software: z.string({ required_error: "requerido" }),
})

export function ComputadoraForm({ deps, usus }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast()

    const defaultValues = {
        fecha: undefined,
        marca: undefined,
        modelo: undefined,
        cpu: undefined,
        almacenamiento: undefined,
        ram: undefined,
        tipo: undefined,
        tipodisco: undefined,
        sistema: undefined,
        software: undefined
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
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    async function onSubmit(data) {
        try {
            data.almacenamiento = data.almacenamiento +" "+ data.tipodisco
            const result = await addComputadora(data)
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

                        {/* Select para Tipo */}
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo</FormLabel>
                                    <FormControl>
                                        <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                    >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="Desktop">
                                                    Desktop
                                                </SelectItem>
                                                <SelectItem value="Laptop">
                                                    Laptop
                                                </SelectItem>                                            
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Select para CPU */}
                        <FormField
                            control={form.control}
                            name="cpu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPU:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Introduce el modelo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                       {/* Select para RAM */}
                        <FormField
                            control={form.control}
                            name="ram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RAM</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} 
                                       
                                        value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un usuario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="4">
                                                    4
                                                </SelectItem>
                                                <SelectItem value="8">
                                                    8
                                                </SelectItem>
                                                <SelectItem value="16">
                                                    16
                                                </SelectItem>
                                                <SelectItem value="32">
                                                    32
                                                </SelectItem>
                                                <SelectItem value="64">
                                                    64
                                                </SelectItem>
                                                <SelectItem value="128">
                                                    128
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Select para Almacenamiento */}
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="almacenamiento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Almacenamiento:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Introduce el nombre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tipodisco"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>tipo disco</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} 
                                            value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                <SelectItem value="HDD">
                                                    HDD
                                                </SelectItem>
                                                <SelectItem value="SDD">
                                                    SDD
                                                </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Select para SO */}
                        <FormField
                            control={form.control}
                            name="sistema"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sistema Operativo</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} 
                                        value={field.value}
                                       >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un SO" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Windows 11">
                                                    Windows 11
                                                </SelectItem>
                                                <SelectItem value="Windows 10">
                                                    Windows 10
                                                </SelectItem>
                                                <SelectItem value="macOS">
                                                    macOS
                                                </SelectItem>
                                                <SelectItem value="linux">
                                                    Linux
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Select para Software*/}
                        <FormField
                            control={form.control}
                            name="software"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Software instalado:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Introduce el nombre" {...field} />
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
