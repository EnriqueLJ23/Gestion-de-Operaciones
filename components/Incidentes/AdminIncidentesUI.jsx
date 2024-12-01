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
import Image from 'next/image';


const getStatusConfig = (status) => {
  const configs = {
    "Pendiente": {
      color: "bg-yellow-100 border-yellow-300",
      textColor: "text-yellow-800",
      icon: <Clock className="h-4 w-4" />,
      description: "Esperando asignación"
    },
    "En Progreso": {
      color: "bg-blue-100 border-blue-300",
      textColor: "text-blue-800",
      icon: <Wrench className="h-4 w-4" />,
      description: "En análisis técnico"
    },
    "Esperando Autorizacion": {
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
    "Cerrada": {
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



const AdminIncidentesUI = ({ incidencias, aulas, elementos, session, edificio, servicio, departamento }) => {
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
  
    const renderMetricsCards = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Incidencias Activas</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-red-500 mt-1">
              4 críticas • 8 alta prioridad
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">SLA en Riesgo</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-yellow-500 mt-1">
              2 próximas a vencer • 5 en alerta
            </div>
            <Progress value={30} className="mt-2" />
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resueltas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <div className="text-xs text-green-500 mt-1">
              ↑ 23% más que ayer
            </div>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Satisfacción</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="text-xs text-purple-500 mt-1">
              ↑ 2% esta semana
            </div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  
    const renderTechnicianStatus = () => {
      const technicians = [
        {
          id: 1,
          name: 'Juan Pérez',
          avatar: '/api/placeholder/32/32',
          specialty: 'Redes',
          activeTickets: 3,
          availability: 'available',
          resolvedLastWeek: 12,
          satisfaction: 4.8
        },
        {
          id: 2,
          name: 'Ana García',
          avatar: '/api/placeholder/32/32',
          specialty: 'Hardware',
          activeTickets: 5,
          availability: 'busy',
          resolvedLastWeek: 15,
          satisfaction: 4.9
        },
      ];
  
      return (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Estado de Técnicos</CardTitle>
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </div>
            <CardDescription>
              Monitoreo en tiempo real de la disponibilidad y carga de trabajo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicians.map(tech => (
                <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={tech.avatar}
                        alt={tech.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${tech.availability === 'available' ? 'bg-green-500' :
                          tech.availability === 'busy' ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`} />
                    </div>
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-gray-500">{tech.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium">Tickets Activos</p>
                      <p className="text-2xl font-bold">{tech.activeTickets}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Satisfacción</p>
                      <p className="text-2xl font-bold">{tech.satisfaction}</p>
                    </div>
                    <Button variant="ghost" size="sm">Ver Detalles</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              2 técnicos activos • 8 tickets en progreso
            </div>
            <Button variant="link" size="sm">Gestionar Asignaciones</Button>
          </CardFooter>
        </Card>
      );
    };
  
    const renderPerformanceChart = () => {
      const data = [
        { name: 'Lun', incidentes: 65, resueltos: 62, slaIncumplido: 3 },
        { name: 'Mar', incidentes: 59, resueltos: 55, slaIncumplido: 4 },
        { name: 'Mie', incidentes: 80, resueltos: 77, slaIncumplido: 3 },
        { name: 'Jue', incidentes: 81, resueltos: 78, slaIncumplido: 3 },
        { name: 'Vie', incidentes: 56, resueltos: 54, slaIncumplido: 2 },
        { name: 'Sab', incidentes: 55, resueltos: 54, slaIncumplido: 1 },
        { name: 'Dom', incidentes: 40, resueltos: 39, slaIncumplido: 1 },
      ];
  
      return (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Rendimiento Semanal</CardTitle>
                <CardDescription>Análisis de incidencias y resoluciones</CardDescription>
              </div>
              <Select defaultValue="week">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mes</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="incidentes"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Incidentes"
                  />
                  <Line
                    type="monotone"
                    dataKey="resueltos"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Resueltos"
                  />
                  <Line
                    type="monotone"
                    dataKey="slaIncumplido"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="SLA Incumplido"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-500">
            <div>Total Incidentes: 436</div>
            <div>Tasa de Resolución: 96.8%</div>
            <div>SLA Cumplimiento: 98.2%</div>
          </CardFooter>
        </Card>
      );
    };
  
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
                <SelectItem value="Pendiente">Pendientes</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Cerrada">Resueltas</SelectItem>
                <SelectItem value="Liberado">Liberadas</SelectItem>
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
            
      
              <Link href={`/incidencias/${incident.id}`} className="w-full">
              <Button className="w-full" size="sm">Ver Detalles</Button>
            </Link>
            
              

            </div>
          </div>
        </CardContent>
      </Card>
    );
  
    return (
      <div className="p-6 max-w-[1100px] w-full mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold mb-2">Gestión de Incidencias</h1>
  
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
  
          <Tabs defaultValue="incidents" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="incidents">Incidencias</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
  
            <TabsContent value="dashboard">
              {renderMetricsCards()}
              {renderTechnicianStatus()}
              {renderPerformanceChart()}
            </TabsContent>
  
            <TabsContent value="incidents">
              {renderFilters()}
              <div className="space-y-4">
                {filteredIncidencias.map(renderIncidentCard)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };
export default AdminIncidentesUI  