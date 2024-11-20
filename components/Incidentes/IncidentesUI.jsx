'use client'

import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { AlertCircle, Package, MapPin, Wrench, Clock, CheckCircle, Search, Users, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { ReporteForm } from '@/app/(with-nav)/incidencias/FormIncidencias';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";


const getStatusConfig = (status) => {
  const configs = {
    "Pendiente": {
      color: "bg-yellow-100 border-yellow-300",
      textColor: "text-yellow-800",
      icon: <Clock className="h-4 w-4" />,
      description: "Esperando asignación"
    },
    "En Diagnostico": {
      color: "bg-blue-100 border-blue-300",
      textColor: "text-blue-800",
      icon: <Wrench className="h-4 w-4" />,
      description: "En análisis técnico"
    },
    "Esperando Confirmacion": {
      color: "bg-purple-100 border-purple-300",
      textColor: "text-purple-800",
      icon: <ClipboardCheck className="h-4 w-4" />,
      description: "Pendiente autorizacion de cambio"
    },
    "Asignado": {
      color: "bg-orange-100 border-orange-300",
      textColor: "text-orange-800",
      icon: <Users className="h-4 w-4" />,
      description: "En proceso"
    },
    "Resuelto": {
      color: "bg-pink-100 border-pink-300",
      textColor: "text-green-800",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Completado, Esperando liberación."
    },
    "Liberado": {
      color: "bg-green-100 border-green-300",
      textColor: "text-green-800",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "El ticket se cerró y fue liberado."
    },
    "Cancelado": {
      color: "bg-red-100 border-red-300",
      textColor: "text-red-800",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Completado, Esperando liberación."
    }
  };
  return configs[status] || configs["Pendiente"];
};

const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <Alert className={`${config.color} border ${config.textColor} mb-4`}>
      <div className="flex items-center gap-2">
        {config.icon}
        <div className="flex flex-col">
          <span className="font-semibold">{status}</span>
          <AlertDescription className="text-sm mt-1">
            {config.description}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};



const IncidentesUI = ({ incidencias, aulas, elementos, session, edificio, servicio, departamento }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [timeRange, setTimeRange] = useState('today');
    const [activeTab, setActiveTab] = useState('dashboard');
  
    const filteredIncidencias = useMemo(() => {
      return incidencias.filter(incident => {
        const matchesSearch = incident.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.id.toString().includes(searchTerm) ||
          incident.elemento.custom_id.toLowerCase().includes(searchTerm.toLowerCase());
  
        const matchesStatus = statusFilter === 'all' || incident.estado.toLowerCase() === statusFilter.toLowerCase();
        const matchesService = serviceFilter === 'all' || incident.servicio?.nombre.toLowerCase() === serviceFilter.toLowerCase();
        const matchesPriority = priorityFilter === 'all' || incident.prioridad.toLowerCase() === priorityFilter.toLowerCase();
  
        return matchesSearch && matchesStatus && matchesService && matchesPriority;
      });
    }, [incidencias, searchTerm, statusFilter, serviceFilter, priorityFilter]);
  

    const renderFilters = () => (
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por ID, descripción o CI..."
                className="pl-8 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:w-2/3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="en progreso">En Progreso</SelectItem>
                <SelectItem value="resolved">Resueltas</SelectItem>
              </SelectContent>
            </Select>
  
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  
    const renderIncidentCard = (incident) => (
      <Card key={incident.id} className={`hover:shadow-lg transition-shadow duration-300 border-l-4 ${getStatusConfig(incident.estado).color}`}>
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="text-sm">#{incident.id}</Badge>
                <Badge variant="secondary" className="text-sm">{incident.elemento.custom_id}</Badge>
                <Badge variant={incident.prioridad === 'alta' ? 'destructive' : 
                             incident.prioridad === 'media' ? 'warning' : 'default'} 
                      className="text-sm">
                  {incident.prioridad}
                </Badge>
                {incident.categoria && (
                  <Badge variant="outline" className="text-sm bg-gray-100">
                    {incident.categoria}
                  </Badge>
                )}
              </div>
    
              <div className="flex gap-2 mb-3">
                <StatusBadge status={incident.estado} />
              </div>
    
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                {incident.servicio?.nombre}
              </h3>
    
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {incident.aula.edificio.departamento.nombre}, Edificio {incident.aula.edificio.nombre} - Aula {incident.aula.nombre}
              </p>
    
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">{incident.descripcion}</p>
            </div>
    
            <div className="col-span-12 md:col-span-3">
              <div className="space-y-2 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700">Asignación</h4>
                  <p className="text-gray-600">Técnico: {incident.tecnicoNombre || "Sin asignar"}</p>
                  <p className="text-gray-600">Creador: {incident.usuarioNombre}</p>
                </div>
    
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-700">Fechas Importantes</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <span className="text-gray-500">Creación:</span>
                      <p className="text-gray-600">{new Date(incident.fechadecreacion).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Límite Respuesta:</span>
                      <p className="text-gray-600">{new Date(incident.fecha_limite_respuesta).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Límite Resolución:</span>
                      <p className="text-gray-600">{new Date(incident.fecha_limite_resolucion).toLocaleDateString()}</p>
                    </div>
                    {incident.fecha_resolucion && (
                      <div>
                        <span className="text-gray-500">Resolución:</span>
                        <p className="text-gray-600">{new Date(incident.fecha_resolucion).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-2 flex md:flex-col gap-2 justify-end">
            
            {incident.estado === "Resuelto" &&
              <Link href={`/incidencias/${incident.id}`} className="w-full">
              <Button className="w-full" size="sm">Ver Detalles</Button>
            </Link>
            }
            {incident.estado === "Liberado" &&
              <Link href={`/incidencias/${incident.id}`} className="w-full">
              <Button className="w-full" size="sm">Ver Detalles</Button>
            </Link>
            } 


            </div>
          </div>
        </CardContent>
      </Card>
    );
  
    return (
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Incidencias</h1>
  
            <div className="flex gap-4">
              <ReporteForm
                aulas={aulas}
                edificio={edificio}
                elementos={elementos}
                session={session}
                servicio={servicio}
                departamento={departamento}
              />
  
    
            </div>
          </div>
  
          {renderFilters()}
              <div className="space-y-4">
                {filteredIncidencias.map(renderIncidentCard)}
              </div>
        </div>
      </div>
    );
  };
export default IncidentesUI  