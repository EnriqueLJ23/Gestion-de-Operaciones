'use client'
import React, { useState } from 'react';
import { Calendar, Clock, Printer, Monitor, Projector } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateCambio } from '@/app/actions/incidencias';
import { useToast } from "@/hooks/use-toast"

const EquipmentIcon = ({ type }) => {
    const icons = {
        proyector: <Projector className="w-5 h-5 text-purple-500" />,
        computadora: <Monitor className="w-5 h-5 text-blue-500" />,
        impresora: <Printer className="w-5 h-5 text-green-500" />
    };
    return icons[type] || null;
};

const EquipmentDetails = ({ elemento }) => {
    if (!elemento) return null;

    const commonDetails = [
        { label: "ID", value: elemento.custom_id },
        { label: "Marca", value: elemento.marca },
        { label: "Modelo", value: elemento.modelo },
    ];

    const specificDetails = {
        proyector: [
            { label: "Horas de uso", value: `${elemento.horasdeuso} horas` }
        ],
        computadora: [
            { label: "CPU", value: elemento.cpu },
            { label: "RAM", value: elemento.ram },
            { label: "Almacenamiento", value: elemento.almacenamiento },
            { label: "SO", value: elemento.sistemaoperativo },
            { label: "Software", value: elemento.softwareinstalado }
        ],
        impresora: [
            { label: "Hojas", value: elemento.hojasimpresas },
            { label: "Tinta", value: `${elemento.niveldetinta}%` }
        ]
    };

    const details = [...commonDetails, ...(specificDetails[elemento.element_type] || [])];

    return (
        <div className="grid grid-cols-4 gap-2 mt-2">
            {details.map((detail, index) => (
                detail.value && (
                    <div key={index} className="bg-gray-50 p-1 rounded">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{detail.label}:</span>
                            <span className="text-xs font-medium truncate ml-1">{detail.value}</span>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

const ChangeCard = ({ change }) => {
    const { toast } = useToast();

    const getStatusBadge = (status) => {
        const variants = {
            "Pendiente": "bg-blue-100 text-blue-800",
            "En revisión": "bg-amber-100 text-amber-800",
            "Completado": "bg-green-100 text-green-800",
            "Autorizado": "bg-purple-100 text-purple-800",
            "Rechazado": "bg-red-100 text-red-800"
        };
        return variants[status] || "default";
    };

    const getRiskBadge = (impact) => {
        const variants = {
            "bajo": "success",
            "medio": "warning",
            "alto": "destructive"
        };
        return variants[impact] || "default";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const renderActionButtons = () => {
        const price = parseFloat(change.componente_catalogo.precio);
        
        if (price > 1000) {
            return (
                <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-md">
                    Se requiere autorización del comité para cambios superiores a $1,000
                </div>
            );
        }
    
        if (change.estado === "Autorizado") {
            return (
                <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-md">
                    Cambio autorizado
                </div>
            );
        }
    
        if (change.estado === "Completado") {
            return (
                <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-md">
                    Cambio completado
                </div>
            );
        }

        const handleAut = async () => {
            const result = await updateCambio({
                cambioId: change.id,
                incidenciaId: change.reporteid,
                status: "Autorizado"
              })
            if (result.success) {
                toast({
                    title: "Actualización exitosa",
                    description: "El Cambio ha sido autorizado.",
                    variant: "positive",
                });
            }
        }
        const handleCan = async () => {
            const result = await updateCambio({
                cambioId: change.id,
                incidenciaId: change.reporteid,
                status: "Rechazado"
              })
            if (result.success) {
                toast({
                    title: "Actualización exitosa",
                    description: "El Cambio ha sido rechazado.",
                    variant: "default",
                });
            }
        }
        return (
            <div className="flex items-center gap-1">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50">
                            Aprobar
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Autorizar el cambio?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción continuará con el proceso de la solución del ticket
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction asChild><Button onClick={handleAut}>Continuar</Button></AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                            Rechazar
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Rechazar el cambio?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción regresará el proceso de la incidencia de vuelta al estado &quot;asignado&quot;
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction asChild><Button onClick={handleCan}>Continuar</Button></AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    };

    return (
        <Card className="hover:shadow-md transition-shadow mb-4">
            <CardContent className="p-2">
                <div className="space-y-1">
                    {/* Header Section */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">#{change.id}</span>
                            <Badge className={`text-xs ${getStatusBadge(change.estado)}`}>{change.estado}</Badge>
                            <Badge className={`text-xs ${getRiskBadge(change.impacto)}`}>{change.impacto}</Badge>
                        </div>
                        {renderActionButtons()}
                    </div>
             
                    <div className='flex justify-between'>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{change.titulo}</h3>
                            <p className="text-sm text-gray-500 mt-1">{change.descripcion}</p>
                        </div>
                        <div className='flex gap-6'>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Componente a cambiar</h3>
                                <p className="text-sm text-gray-500 mt-1">{change.componente_catalogo.nombre}</p>                        
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Cotizacion</h3>
                                <p className="text-sm text-gray-500 mt-1">${change.componente_catalogo.precio}</p>                        
                            </div>
                        </div>
                    </div>

                    {/* Equipo Section */}
                    <div className="bg-gray-200 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <EquipmentIcon type={change.elemento.element_type} />
                            <h4 className="text-md font-semibold capitalize">
                                {change.elemento.element_type}
                            </h4>
                        </div>
                        <EquipmentDetails elemento={change.elemento} />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <p className="text-gray-500">Solicitante</p>
                                <p className="font-medium">{change.solicitante.nombre}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <p className="text-gray-500">Autor de Ultimo Cambio</p>
                                <p className="font-medium">{change.elemento.autorultimocambio.nombre}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div className="text-sm">
                                <p className="text-gray-500">Fecha de Ultimo Cambio</p>
                                <p className="font-medium">{formatDate(change.elemento.fechadeultimocambio)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div className="text-sm">
                                <p className="text-gray-500">Fecha creación</p>
                                <p className="font-medium">{formatDate(change.fechaCreacion)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChangeCard;