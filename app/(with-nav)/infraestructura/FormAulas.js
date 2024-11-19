"use client"
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
import { useState, useEffect } from "react"
import { addAula } from "@/app/actions/departamentos"
import { PlusCircle, MinusCircle } from "lucide-react"
// Zod schema validation
const FormSchema = z.object({
    nombre: z.string({ required_error: "El nombre es requerido" }).min(2, { message: "¿Cual Es Tu Plan?" }),
    departamento: z.string({ required_error: "Selecciona un departamento" }),
    edificio: z.string({ required_error: "Selecciona un edificio" }),
    responsable: z.string().optional(),
    cis: z.array(z.object({
        tipo: z.string({ required_error: "Selecciona un tipo de CI" }),
        aparatoId: z.string({ required_error: "Selecciona un aparato" }),
    })),
})

export function AulaForm({ deps, usus, edificios, elementos }) {
    const [variant, setVariant] = useState("")
    const [message, setMessage] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [showF, setShowF] = useState(false)
    const [filteredEdificios, setFilteredEdificios] = useState([]);
    const [selectedDep, setSelectedDep] = useState("");
    const [cis, setCIs] = useState([]);

    const elementosPorTipo = elementos.reduce((acc, elemento) => {
        if (!acc[elemento.element_type]) {
            acc[elemento.element_type] = [];
        }
        acc[elemento.element_type].push(elemento);
        return acc;
    }, {});



    const fDeps = deps.map((depa) => ({
        value: depa.id,
        label: depa.nombre,
    }))
    const fUsus = usus.map((usu) => ({
        value: usu.id,
        label: usu.nombre,
    }))

    const defaultValues = {
        nombre: undefined,
        departamento: undefined,
        edificio: undefined,
        responsable: undefined,
        cis: [],
    }

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues
    })

    const tiposCIs = ["computadora", "impresora", "proyector"];



    const agregarCI = () => {
        setCIs([...cis, { tipo: "", aparatoId: "" }]);
      };
    const eliminarCI = (index) => {
        const nuevosCIs = cis.filter((_, i) => i !== index);
        setCIs(nuevosCIs);
        form.setValue('cis', nuevosCIs);

    };

    const actualizarCI = (index, campo, valor) => {
        const nuevosCIs = [...cis];
        nuevosCIs[index][campo] = valor;
        if (campo === 'tipo') {
          nuevosCIs[index].aparatoId = ""; // Reset aparatoId when tipo changes
        }
        setCIs(nuevosCIs);
        form.setValue('cis', nuevosCIs);
      };




    useEffect(() => {

        const edificioOptions = selectedDep
            ? edificios.filter(e => e.departamentoid.toString() === selectedDep)
                .map(e => ({ value: e.id.toString(), label: e.nombre }))
            : [];
        setFilteredEdificios(edificioOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDep]);





    async function onSubmit(data) {
        try {
            const aulaData = {
                ...data,
                cis: cis.map(ci => ({
                  tipo: ci.tipo,
                  aparatoId: parseInt(ci.aparatoId) 
                }))
              };

            const result = await addAula(aulaData)
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
            }, 3000)
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
                                name="departamento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departamento</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value) => {
                                                field.onChange(value);
                                                console.log(value);

                                                setSelectedDep(value);
                                                form.setValue("fEdi", "");
                                            }} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona departamento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fDeps.map((dep) => (
                                                        <SelectItem key={dep.value} value={dep.value.toString()}>
                                                            {dep.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Select field for Edificio */}
                            <FormField
                                control={form.control}
                                name="edificio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Edificio</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDep} >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un eduificio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredEdificios.map((edificio) => (
                                                        <SelectItem key={edificio.value} value={edificio.value}>
                                                            {edificio.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Select field for fUsu */}
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

                            {/* Sección de CIs */}
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
                                             <Select value={field.value} onValueChange={(value) => actualizarCI(index, 'tipo', value)}>
                                               <SelectTrigger className="w-[180px]">
                                                 <SelectValue placeholder="Seleccione un CI" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 {tiposCIs.map((tipo) => (
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
                                             <Select value={field.value} onValueChange={(value) => actualizarCI(index, 'aparatoId', value)}>
                                               <SelectTrigger className="w-[180px]">
                                                 <SelectValue placeholder="Seleccione un aparato" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 {elementosPorTipo[ci.tipo]?.map((elemento) => (
                                                   <SelectItem 
                                                   key={elemento.id} 
                                                   value={elemento.id.toString()}>
                                                     {elemento.custom_id}
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
                                    <PlusCircle size={24} className="mr-1" />  Agregar CI
                                </Button>
                            </div>



                            <div className="flex justify-between">
                                <Button onClick={() => setShowF(!showF)} className="" variant="outline"  >Cancelar</Button>
                                <Button type="submit">Guardar</Button>
                            </div>
                        </form>
                    </Form>
          </>

    )
}
