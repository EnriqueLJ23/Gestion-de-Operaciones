'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "./ui/input"

const FormSchema = z.object({
  nombre: z.string({ required_error: "El nombre es requerido" }).min(2, { message: "El nombre es muy corto" }),
  departamento: z.string({ required_error: "Selecciona un departamento" }),
  edificio: z.string({ required_error: "Selecciona un edificio" }),
  responsable: z.string().optional(),
  cis: z.array(z.object({
    tipo: z.string({ required_error: "Selecciona un tipo de CI" }),
    aparatoId: z.string({ required_error: "Selecciona un aparato" }),
  })),
})

const UpdateDialog = ({ aulaData }) => {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    departamentos: [],
    usuarios: [],
    edificios: [],
    aparatos: {
      computadora: [],
      impresora: [],
      proyector: []
    }
  })
  const [filteredEdificios, setFilteredEdificios] = useState([])
  const [selectedDep, setSelectedDep] = useState("")
  const [cis, setCIs] = useState([])

  // Fetch all data when dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/aulas')
          const data = await response.json()
          
          setFormData({
            departamentos: data.departamentos,
            usuarios: data.usuarios,
            edificios: data.edificios,
            aparatos: data.aparatos
          })

          // Initialize CIs from aulaData
          const initialCIs = aulaData.cis.map(ci => ({
            tipo: determineDeviceType(ci),
            aparatoId: ci.id.toString()
          }))
          setCIs(initialCIs)
        } catch (error) {
          console.error('Error fetching data:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Error al cargar los datos",
          })
        }
      }

      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Update filtered edificios when department is selected
  useEffect(() => {
    if (selectedDep) {
      const filtered = formData.edificios.filter(e => e.departamentoid.toString() === selectedDep)
      setFilteredEdificios(filtered)
    }
  }, [selectedDep, formData.edificios])

  function determineDeviceType(device) {
    return device.tipo || "computadora"
  }

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nombre: aulaData.nombre,
      departamento: aulaData.departamento,
      edificio: aulaData.edificio,
      responsable: aulaData.responsable,
      cis: []
    }
  })

  const agregarCI = () => {
    setCIs([...cis, { tipo: "", aparatoId: "" }])
  }

  const eliminarCI = (index) => {
    const nuevosCIs = cis.filter((_, i) => i !== index)
    setCIs(nuevosCIs)
    form.setValue('cis', nuevosCIs)
  }

  const actualizarCI = (index, campo, valor) => {
    const nuevosCIs = [...cis]
    nuevosCIs[index][campo] = valor
    if (campo === 'tipo') {
      nuevosCIs[index].aparatoId = ""
    }
    setCIs(nuevosCIs)
    form.setValue('cis', nuevosCIs)
  }

  async function onSubmit(formData) {
    try {
      const response = await fetch(`/api/aulas/${aulaData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cis: cis.map(ci => ({
            tipo: ci.tipo,
            aparatoId: parseInt(ci.aparatoId)
          }))
        }),
      })

      if (!response.ok) throw new Error('Error al actualizar el aula')

      toast({
        title: "Éxito",
        description: "Aula actualizada correctamente",
      })
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Aula</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedDep(value)
                        form.setValue("edificio", "")
                      }} 
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.departamentos.map((dep) => (
                          <SelectItem key={dep.id} value={dep.id.toString()}>
                            {dep.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="edificio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edificio</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      disabled={!selectedDep}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un edificio" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEdificios.map((edificio) => (
                          <SelectItem key={edificio.id} value={edificio.id.toString()}>
                            {edificio.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encargado/Responsable</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.usuarios.map((usu) => (
                          <SelectItem key={usu.id} value={usu.id.toString()}>
                            {usu.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="font-semibold">CIs en el Aula</h3>
              {cis.map((ci, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name={`cis.${index}.tipo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => actualizarCI(index, 'tipo', value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Seleccione un CI" />
                            </SelectTrigger>
                            <SelectContent>
                              {["computadora", "impresora", "proyector"].map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`cis.${index}.aparatoId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => actualizarCI(index, 'aparatoId', value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Seleccione un aparato" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.aparatos[ci.tipo]?.map((aparato) => (
                                <SelectItem key={aparato.id} value={aparato.id.toString()}>
                                  {aparato.custom_id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    onClick={() => eliminarCI(index)}
                    variant="destructive"
                    size="icon"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={agregarCI}
                variant="ghost"
                className="mt-2 flex items-center text-blue-500"
              >
                <PlusCircle size={24} className="mr-1" /> Agregar CI
              </Button>
            </div>

            <div className="flex justify-between">
              <Button type="button" onClick={() => setOpen(false)} variant="outline">
                Cancelar
              </Button>
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateDialog