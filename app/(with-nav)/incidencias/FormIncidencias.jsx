"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { useState, useEffect } from "react"
import { Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { createReporte } from "@/app/actions/incidencias"

// Zod schema validation
const FormSchema = z.object({
    departamento: z.string({ required_error: "El departamento es requerido" }),
    edificio: z.string({ required_error: "El edificio es requerido" }),
    aula: z.string({ required_error: "El aula es requerida" }),
    tipoele: z.string({ required_error: "El tipo es requerido" }),
    elemento: z.string({ required_error: "El elemento es requerido" }),
    servicio: z.string({ required_error: "El servicio es requerido" }),
    descripcion: z.string({ required_error: "La descripción es requerida" })
        .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
})

export function ReporteForm({ aulas, elementos, session,edificio, servicio,departamento }) {
    const [open, setOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("")
    const [selectedDep, setSelectedDep] = useState("")
    const [selectedEd, setSelectedEd] = useState("")
    const [selectedAu, setSelectedAu] = useState("")
    const { toast } = useToast()

    const defaultValues = {
        departamento: undefined,
        edificio: undefined,
        aula: undefined,
        tipoele: undefined,
        elemento: undefined,
        servicio: undefined,
        descripcion: ""

    }

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues,
    })
    const resetForm = () => {
        form.reset(defaultValues);
        setSelectedType("");
        setSelectedDep("");
        setSelectedEd("");
        setSelectedAu("");
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);





  const filteredServices = servicio.filter(
    group => group.categoria.nombre === selectedType
)|| []

const filteredElementos = elementos.filter(
    elemento => elemento.element_type === selectedType && elemento.aulaid.toString() === selectedAu
) || []

const filteredEdificios = edificio.filter(
    edificio => edificio.departamentoid.toString() === selectedDep
) || []

const filteredAulas = aulas.filter(
    aula => aula.edificioid.toString() === selectedEd
) || []

    // Handle type selection
    const handleTypeChange = (value) => {
        setSelectedType(value)
        form.setValue("servicio", undefined)
        form.setValue("elemento", undefined)
    }

    const handleDepChange = (value) => {
        setSelectedDep(value)
        setSelectedEd("")
        setSelectedAu("")
        setSelectedType("")
        form.reset({
            ...defaultValues,
            departamento: value
        })
    }

    const handleEdChange = (value) => {
        setSelectedEd(value)
        setSelectedAu("")
        setSelectedType("")
        form.setValue("aula", undefined)
        form.setValue("tipoele", undefined)
        form.setValue("elemento", undefined)
        form.setValue("servicio", undefined)
    }

    const handleAuChange = (value) => {
        setSelectedAu(value)
        setSelectedType("")
        form.setValue("tipoele", undefined)
        form.setValue("elemento", undefined)
        form.setValue("servicio", undefined)
    }


    async function onSubmit(data) {
        console.log("Formulario enviado:", data);

        try {
            // Llama a la acción del servidor `createReporte` con los datos del formulario
            const result = await createReporte(data, session);

            if (result.success) {
                toast({
                    variant: "positive",
                    title: "Reporte creado",
                    description: "El reporte se ha creado exitosamente.",
                });
                setOpen(false); // Cierra el diálogo
                resetForm(); // Resetea el formulario
            } else {
                throw new Error(result.error || "No se pudo crear el reporte");
            }
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>                
                <Button className="bg-blue-500 text-white" onClick={() => setOpen(true)}>
                <Plus className="mr-2"/>
                    Crear Reporte</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Reporte</DialogTitle>
                </DialogHeader>
                <Form {...form} asChild>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Departamento Select */}
                        <FormField
                            control={form.control}
                            name="departamento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Departamento</FormLabel>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value)
                                        handleDepChange(value)
                                    }} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un departamento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departamento?.map((dep) => (
                                                <SelectItem key={dep.id} value={dep.id.toString()}>
                                                    {dep.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Edificio Select */}
                        <FormField
                            control={form.control}
                            name="edificio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Edificio</FormLabel>
                                    <Select 
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            handleEdChange(value)
                                        }} 
                                        value={field.value || ""}
                                        disabled={!selectedDep}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un edificio" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filteredEdificios?.map((ed) => (
                                                <SelectItem key={ed.id} value={ed.id.toString()}>
                                                    {ed.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Aula Select */}
                        <FormField
                            control={form.control}
                            name="aula"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aula</FormLabel>
                                    <Select 
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            handleAuChange(value)
                                        }}  
                                        value={field.value}
                                        disabled={!selectedEd}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un aula" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filteredAulas?.map((aula) => (
                                                <SelectItem key={aula.id} value={aula.id.toString()}>
                                                    {aula.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            {/* Tipo Select */}
                            <FormField
                                control={form.control}
                                name="tipoele"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Tipo</FormLabel>
                                        <Select 
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                handleTypeChange(value)
                                            }} 
                                            value={field.value}
                                            disabled={!selectedAu}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>                                              
                                                    <SelectItem value="computadora">
                                                        Computadora
                                                    </SelectItem>
                                                    <SelectItem value="impresora">
                                                        Impresora
                                                    </SelectItem>
                                                    <SelectItem value="proyector">
                                                        Proyector
                                                    </SelectItem>  
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Elemento Select */}
                            <FormField
                                control={form.control}
                                name="elemento"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Elemento</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value}
                                            disabled={!selectedType}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un elemento" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {filteredElementos?.map((elemento) => (
                                                    <SelectItem key={elemento.id} value={elemento.id.toString()}>
                                                        {elemento.custom_id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Servicio Select */}
                        <FormField
                            control={form.control}
                            name="servicio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Servicio</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        disabled={!selectedType}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un servicio" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filteredServices.map((service) => (
                                                <SelectItem key={service.id} value={service.id.toString()}>
                                                    {service.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Descripción Textarea */}
                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describa el problema..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between">
                            <Button type="button" onClick={() => setOpen(false)} variant="outline">Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}