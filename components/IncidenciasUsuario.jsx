'use client'
import React from 'react';
import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import {
    AlertCircle,
    Clock,
    MapPin,
    User,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Calendar,
    Building2,
    Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import EvaluacionDialog from './EvaluacionDialog';

export function IncidenciasUsuario({ incidencia, servicio, tecnico }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const incident = {
        id: incidencia.id,
        location: incidencia.aula.edificio.departamento.nombre,
        building: `Edificio ${incidencia.aula.edificio.nombre}`,
        room: incidencia.aula.nombre,
        ciElement: incidencia.elementoid ? `Elemento ${incidencia.elementoid}` : 'N/A',
        description: incidencia.descripcion,
        priority: incidencia.prioridad,
        reportedBy: incidencia.creador.nombre,
        reportedAt: incidencia.fechadecreacion,
        respondBy: incidencia.fecha_limite_respuesta,
        finishBy: incidencia.fecha_limite_resolucion,
        servicio: incidencia.servicio.nombre,
        tecnicoN: incidencia.tecnicoasignado.nombre,
        estado: "Resuelto", // This would come from your data
        diagnostico: "El equipo presentaba problemas de conectividad debido a un cable de red dañado.",
        solucion: "Se reemplazó el cable de red y se verificó la conectividad."
    };

    const getPriorityStyles = (priority) => {
        const styles = {
            'alta': 'bg-red-100 text-red-800 border-red-200',
            'media': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'baja': 'bg-green-100 text-green-800 border-green-200'
        };
        return `${styles[priority]} px-3 py-1 rounded-full text-xs font-medium border`;
    };

    const submitEvaluation = (data) => {
        toast({
            title: "Evaluación enviada",
            description: "Gracias por tu evaluación.",
            variant: "default",
        });
        setIsDialogOpen(false);
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

            <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-primary" />
                            <span>Incidencia #{incident.id}</span>
                        </div>
                        <span className={`${getPriorityStyles(incident.priority)} ml-4`}>
                            {incident.priority.toUpperCase()}
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Incident Details */}
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Ubicación
                                </h3>
                                <div className="space-y-4 ml-7">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{incident.location}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {incident.building} - {incident.room}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Fechas
                                </h3>
                                <div className="space-y-3 ml-7">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">
                                            Reportado: {new Date(incident.reportedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">
                                            Reportado por: <span className="font-medium">{incident.reportedBy}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Wrench className="h-5 w-5 text-primary" />
                                    Detalles del Servicio
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Servicio</h4>
                                        <p className="bg-background p-3 rounded-lg border">
                                            {incident.servicio}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Técnico asignado</h4>
                                        <p className="bg-background p-3 rounded-lg border">
                                            {incident.tecnicoN}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-6 rounded-lg shadow-sm">
                                <h4 className="text-lg font-semibold mb-4">Descripción</h4>
                                <p className="bg-background p-4 rounded-lg border">
                                    {incident.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {incidencia.estado === "Resuelto" && (
                        <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-800">Resolución de Incidencia</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Diagnóstico</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incident.diagnostico}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Solución</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incident.solucion}
                                    </p>
                                </div>
                            </div>   
                            {incidencia.estado === "Resuelto" &&
                                <EvaluacionDialog incidenciaId={incident.id} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen}/>    
                            }
                            
                        </div>
                    )}
                    
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
                                        {incident.diagnostico}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Solución</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incident.solucion}
                                    </p>
                                </div>
                            </div>   
                            
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}

export default IncidenciasUsuario;