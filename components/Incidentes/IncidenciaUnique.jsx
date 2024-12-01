'use client';

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    Clock,
    MapPin,
    User,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock4
} from 'lucide-react';
import Link from 'next/link';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateReporte } from "@/app/actions/incidencias";

const formSchema = z.object({
    tecnicoId: z.string({
        required_error: "Por favor seleccione un técnico",
    }),
    prioridad: z.string({
        required_error: "Por favor seleccione una prioridad",
    }),
    categoria: z.string({
        required_error: "Por favor seleccione una categoria",
    }),
});

export function IncidenciaID({ incidencia, servicio, tecnico }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(incidencia.estado === "Pendiente" ? false : true);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tecnicoId: incidencia.tecnicoasignadoid?.toString() || undefined,
            prioridad: incidencia.prioridad?.toString() || undefined,
            categoria: incidencia.categoria?.toString() || undefined,
        },
    });

    const incident = {
        id: incidencia.id,
        location: incidencia.aula.edificio.departamento.nombre,
        building: `Edificio ${incidencia.aula.edificio.nombre}`,
        room: incidencia.aula.nombre,
        ciElement: incidencia.elementoid ? `Elemento ${incidencia.elementoid}` : 'N/A',
        description: incidencia.descripcion,
        priority: incidencia.prioridad,
        estado: incidencia.estado,
        reportedBy: incidencia.creador.nombre,
        reportedAt: incidencia.fechadecreacion,
        respondBy: incidencia.fecha_limite_respuesta,
        finishBy: incidencia.fecha_limite_resolucion,
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completado':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'Cancelado':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'Pendiente':
                return <Clock4 className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    const getStatusStyles = (status) => {
        const styles = {
            'Completado': 'bg-green-100 text-green-800 border-green-200',
            'Cancelado': 'bg-red-100 text-red-800 border-red-200',
            'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'En Proceso': 'bg-blue-100 text-blue-800 border-blue-200',
            'Asignado': 'bg-orange-100 text-orange-800 border-orange-200',
            'Esperando Confirmacion': 'bg-purple-100 text-purple-800 border-purple-200',
            'Resuelto': 'bg-green-100 text-purple-800 border-purple-200'
        };
        return `${styles[status]} px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 w-fit`;
    };

    const getPriorityStyles = (priority) => {
        const styles = {
            'alta': 'bg-red-100 text-red-800 border-red-200',
            'media': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'baja': 'bg-green-100 text-green-800 border-green-200'
        };
        return `${styles[priority]} px-3 py-1 rounded-full text-xs font-medium border`;
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await updateReporte({
                incidenteId: incident.id,
                tecnicoAsignadoId: data.tecnicoId,
                servicioId: data.servicioId,
                categoria: data.categoria,
                prioridad: data.prioridad
            });

            if (response.success) {
                toast({
                    title: "Actualización exitosa",
                    description: "La incidencia ha sido actualizada correctamente.",
                    variant: "positive",
                });
                if (incident.estado !== "Pendiente") {
                    setShowForm(false);
                }
            } else {
                throw new Error(response.error || "Error al actualizar la incidencia");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <Link
                href="/incidencias"
                className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Incidencias
            </Link>

            <Card className="shadow-lg">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-primary" />
                            Incidencia #{incident.id}
                        </CardTitle>
                        <div className={getStatusStyles(incident.estado)}>
                            {getStatusIcon(incident.estado)}
                            {incident.estado}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Incident Details */}
                        <div className="space-y-6">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Detalles de la Incidencia</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="font-medium">{incident.location}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {incident.building} - {incident.room}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm">
                                                Reportado: {new Date(incident.reportedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">
                                            Reportado por: <span className="font-medium">{incident.reportedBy}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Descripción</h4>
                                <p className="text-muted-foreground bg-background p-3 rounded-lg border">
                                    {incident.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Prioridad:</span>
                                    <span className={getPriorityStyles(incident.priority)}>
                                        {incident.priority}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form or Edit Button */}
                        <div>


                            {true && (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="categoria"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Categoria</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            disabled={showForm}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione la categoria" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Hardware">Hardware</SelectItem>
                                                                <SelectItem value="Software">Software</SelectItem>
                                                                <SelectItem value="Redes">Redes</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                      
                                        <FormField
                                            control={form.control}
                                            name="tecnicoId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Técnico</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            disabled={showForm}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione un técnico" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {tecnico.map((technician) => (
                                                                    <SelectItem
                                                                        key={technician.id}
                                                                        value={technician.id.toString()}
                                                                    >
                                                                        {technician.nombre} - {technician.especialidad}
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
                                            name="prioridad"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Prioridad</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            disabled={showForm}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione la prioridad" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Alta">Alta</SelectItem>
                                                                <SelectItem value="Media">Media</SelectItem>
                                                                <SelectItem value="Baja">Baja</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {incidencia.estado !== "Pendiente" && incidencia.estado !== "Liberado" && showForm && (
                                            <Button
                                                onClick={() => setShowForm(false)}
                                                className="w-full mb-6"
                                                type="button"
                                            >
                                                Editar Incidencia
                                            </Button>
                                        ) }
                                        {incidencia.estado === "Pendiente" && (
                                            <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Actualizando...
                                                </>
                                            ) : (
                                                'Actualizar Incidencia'
                                            )}
                                        </Button>)}

                                    </form>
                                </Form>
                                
                            )}
                            
                        </div>
                        
                    </div>
                        <div>
                              
                    {incidencia.estado === "Liberado" && (
                        <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-800">Resolución de Incidencia</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Diagnóstico</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incidencia.diagnostico}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Solución</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incidencia.solucion}
                                    </p>
                                </div>
                            </div>   
                            
                        </div>
                    )}
                      {incidencia.estado === "Cerrada" && (
                        <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-800">Resolución de Incidencia</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Diagnóstico</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incidencia.diagnostico}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Solución</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incidencia.solucion}
                                    </p>
                                </div>
                            </div>   
                            
                        </div>
                    )}
                        </div>
                    </div>
                    
                </CardContent>
            </Card>
        </div>
    );
}

export default IncidenciaID;