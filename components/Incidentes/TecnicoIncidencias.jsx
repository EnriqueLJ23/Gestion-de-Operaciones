'use client'

import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { AlertCircle, MapPin, Clock, CheckCircle, Search, Users, ClipboardCheck, BarChart3,ExternalLink  } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { ReporteForm } from '@/app/(with-nav)/incidencias/FormIncidencias';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStatusConfig = (status) => {
  const configs = {
    "Pendiente": {
      color: "text-yellow-800 bg-yellow-100",
      icon: <Clock className="h-4 w-4" />,
    },
    "En Diagnostico": {
      color: "text-blue-800 bg-blue-100",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    "Esperando Confirmacion": {
      color: "text-purple-800 bg-purple-100",
      icon: <ClipboardCheck className="h-4 w-4" />,
    },
    "Asignado": {
      color: "text-orange-800 bg-orange-100",
      icon: <Users className="h-4 w-4" />,
    },
    "Resuelto": {
      color: "text-pink-800 bg-pink-100",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    "Liberado": {
      color: "text-green-800 bg-green-100",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    "Cancelado": {
      color: "text-red-800 bg-red-100",
      icon: <AlertCircle className="h-4 w-4" />,
    }
  };
  return configs[status] || configs["Pendiente"];
};

const getPrioridadBadge = (prioridad) => {
  const variants = {
    alta: "destructive",
    media: "warning",
    baja: "secondary"
  };
  return <Badge variant={variants[prioridad.toLowerCase()]}>{prioridad.toUpperCase()}</Badge>;
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const TecnicoIncidencias = ({ incidencias, aulas, elementos, session, edificio, servicio, departamento }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const filteredIncidencias = useMemo(() => {
      return incidencias.filter(incident => {
        const matchesSearch = incident.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.id.toString().includes(searchTerm) ||
          incident.elemento.custom_id.toLowerCase().includes(searchTerm.toLowerCase());
  
        const matchesStatus = statusFilter === 'all' || incident.estado.toLowerCase() === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === 'all' || incident.prioridad.toLowerCase() === priorityFilter.toLowerCase();
  
        return matchesSearch && matchesStatus && matchesPriority;
      });
    }, [incidencias, searchTerm, statusFilter, priorityFilter]);
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-2/3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Asignada</SelectItem>
                <SelectItem value="en progreso">En Progreso</SelectItem>
                <SelectItem value="Resuelta">Resuelta</SelectItem>
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
  
    return (
      <div className="p-6 max-w-[1100px] w-full mx-auto">
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
          <Card>
        <CardContent className="p-4">
        <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">ID</TableHead>
                  <TableHead>CI</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>                  
                  <TableHead>Descripción</TableHead>
                  <TableHead>Ubicación</TableHead>                  
                  <TableHead>Fecha Límite</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidencias.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">
                      <div className="">                        
                        <Badge variant="outline" className="text-xs">
                        #{incident.id}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="">
                        <Badge variant="outline" className="text-xs">
                          {incident.elemento.custom_id}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getStatusConfig(incident.estado).color}`}>
                        {getStatusConfig(incident.estado).icon}
                        <span className="text-xs font-medium">{incident.estado}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getPrioridadBadge(incident.prioridad)}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={incident.descripcion}>
                        {incident.descripcion}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {incident.aula.edificio.nombre} - {incident.aula.nombre}
                        </span>
                      </div>
                    </TableCell>
               
                    <TableCell>
                      <span className="text-sm">
                        {formatDateTime(incident.fecha_limite_respuesta)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/incidencias/${incident.id}`}>
                        <Button size="sm" variant="outline">
                          <ExternalLink  className='w-4 h-4 mr-1'/>
                          Abrir
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
         
        </div>
      </div>
    );
  };

export default TecnicoIncidencias;