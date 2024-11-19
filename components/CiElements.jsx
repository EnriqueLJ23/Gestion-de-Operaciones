'use client'
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Server, Laptop, Projector, Globe,Printer, Computer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComputadoraForm } from '@/app/(with-nav)/configuraciones/FormCompus';
import { ImpresoraForm } from '@/app/(with-nav)/configuraciones/FormImpre';
import { ProyectorForm } from '@/app/(with-nav)/configuraciones/FormProyectores';
import { deleteCI } from '@/app/actions/elementosCI';
import DeleteDialog from './DeleteDialog';
import CICard from './CICard';

const CIManagement = ({data}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getIcon = (type) => {
    switch (type) {
      case 'computadora': return <Laptop className="h-5 w-5" />;
      case 'impresora': return <Printer className="h-5 w-5" />;
      case 'proyector': return <Projector className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const getStatusColor = (item) => {
    // Ejemplo de lógica para determinar el estado basado en diferentes criterios
    if (item.element_type === 'impresora' && item.niveldetinta < 20) {
      return { color: 'bg-red-100 text-red-800', text: 'Tinta Baja' };
    }
    if (item.element_type === 'proyector' && item.horasdeuso > 800) {
      return { color: 'bg-yellow-100 text-yellow-800', text: 'Mantenimiento Requerido' };
    }
    return { color: 'bg-green-100 text-green-800', text: 'Activo' };
  };

  const filteredItems = data.filter(item => {
    const matchesSearch = 
      item.custom_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.element_type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const NewCIForm = () => (
    <div className="space-y-4">
       <Tabs defaultValue="computadora" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="computadora" className="flex items-center gap-2">
              <Computer className="h-4 w-4" />
              Computadora
            </TabsTrigger>
            <TabsTrigger value="impresora" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Impresora
            </TabsTrigger>
            <TabsTrigger value="proyector" className="flex items-center gap-2">
              <Projector className="h-4 w-4" />
              Proyector
            </TabsTrigger>
          </TabsList> 
        </div>

   
        <TabsContent value="computadora" className="m-0">
          <ComputadoraForm />
        </TabsContent>

        <TabsContent value="impresora" className="m-0">
          <ImpresoraForm />
        </TabsContent>

        <TabsContent value="proyector" className="m-0">
         <ProyectorForm />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="p-6 max-w-[1100px] w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Elementos de Configuración</h1>
        <p className="text-gray-600">Sistema de Gestión ITIL - Universidad</p>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar CIs..."
              className="pl-10 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
       <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="computadora">Computadoras</SelectItem>
              <SelectItem value="impresora">Impresoras</SelectItem>
              <SelectItem value="proyector">Proyectores</SelectItem>
            </SelectContent>
          </Select>

        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo CI
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo CI</DialogTitle>
            </DialogHeader>
            <NewCIForm />
          </DialogContent>
        </Dialog>
      </div>

 
      <div className="space-y-4">
        {filteredItems.map((item) => (
         <CICard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CIManagement;