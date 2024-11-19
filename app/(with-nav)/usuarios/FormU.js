"use client"
import { RocketIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Search, UserPlus, Edit2, Trash2 } from 'lucide-react';
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
import { createUsuario } from "@/app/actions/usuarios"
// Zod schema validation
const FormSchema = z.object({
  nombre: z.string({ required_error: "requerido" }).min(2, { message: "9mm" }),
  rol: z.string({ required_error: "Selecciona un rol" }),
  especialidad: z.string({ required_error: "requerido" }),
  departamento: z.string({ required_error: "Selecciona un departamento" }),
})

export function FormUsuarios({ departamentos }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast()

  const defaultValues = {
    nombre: "",
    rol: undefined,
    especialidad: undefined,
    departamento: undefined
  }

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  })

  const resetForm = () => {
    form.reset(defaultValues);
  };
  useEffect(() => {

    if (!isOpen) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function onSubmit(data) {
    try {
      data.almacenamiento = data.almacenamiento + " " + data.tipodisco
      const result = await createUsuario(data)
      toast({
        title: "Hoy brindare por ti!",
        description: result.message,
        variant: "positive",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.message || "Error en la creación del Departamento",
        title: "Error",
      });
      console.log(error.message);

    } 
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <Form {...form} asChild >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Input para Marca */}
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

              {/* Select para Tipo */}
              <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol del usuario</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">
                          Jefe de Taller
                        </SelectItem>
                        <SelectItem value="3">
                          Tecnico
                        </SelectItem>
                        <SelectItem value="4">
                          Usuario normal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           

              {/* Select para Tipo */}
              <FormField
              control={form.control}
              name="especialidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidad</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la Especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hardware">
                          Hardware
                        </SelectItem>
                        <SelectItem value="Software">
                          Software
                        </SelectItem>
                        <SelectItem value="Redes">
                          Redes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
            {/* Select para Tipo */}
            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map(dep => 
                        <SelectItem key={dep.id} value={dep.id.toString()}>
                          {dep.nombre}
                        </SelectItem>)}                    
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           



            <div className="flex justify-between">
              <Button type="button" onClick={() => setIsOpen(false)} className="" variant="outline">Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
