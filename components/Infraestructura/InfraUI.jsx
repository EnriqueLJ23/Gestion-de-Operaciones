'use client'
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, GraduationCap, DoorOpen, Server, ChevronRight, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DepartamentoForm } from '@/app/(with-nav)/infraestructura/FormDepartamentos';
import { EdificioForm } from '@/app/(with-nav)/infraestructura/FormEdificios';
import { AulaForm } from '@/app/(with-nav)/infraestructura/FormAulas';
import DeleteDialog from '../DeleteDialog';
import { deleteAula, deleteDepartamento, deleteEdificio } from '@/app/actions/departamentos';

const InfrastructureManager = ({departamentos, edificios,aulas,usus,elementos}) => {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchTerm, setSearchTerm] = useState('');

 // Filtrar elementos basado en el término de búsqueda
 const filteredDepartamentos = departamentos.filter(dept =>
  dept.nombre.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredEdificios = edificios.filter(building =>
  building.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  building.departamento.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredAulas = aulas.filter(room =>
  room.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  room.edificio.toLowerCase().includes(searchTerm.toLowerCase()) ||
  room.elementos.some(ci => 
    ci.custom_id.toLowerCase().includes(searchTerm.toLowerCase())
  )
);

const DepartmentsView = () => (
  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 h-full">
    {filteredDepartamentos.map((dept) => (
      <Card key={dept.id} className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">{dept.nombre}</h3>
                <p className="text-sm text-gray-600">{dept.edificio.length} edificios</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
              <DeleteDialog data={dept.id} deleteTh={deleteDepartamento}/>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);


const BuildingsView = () => (
  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
    {filteredEdificios.map((building) => (
      <Card key={building.id} className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Edificio {building.nombre}</h3>
                <p className="text-sm text-gray-600">{building.departamento}</p>
                <p className="text-sm text-gray-600">{building.aula.length} aulas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
              <DeleteDialog data={building.id} deleteTh={deleteEdificio}/>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
const RoomsView = () => (
  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
    {filteredAulas.map((room) => (
      <Card key={room.id} className="max-h-96 hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DoorOpen className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">{room.nombre}</h3>
                <p className="text-sm text-gray-600">Edificio: {room.edificio}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
              <DeleteDialog data={room.id} deleteTh={deleteAula} />
            </div>
          </div>
          <div className="flex-1 min-h-0 mt-4">
            <p className="text-sm font-medium mb-2">CIs en esta ubicación:</p>
            <div className="overflow-y-auto max-h-32">
              <div className="grid grid-cols-3 gap-2 mb-1">
                {room.elementos.map(ci => (
                  <Button 
                    key={ci.id}
                    className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex-shrink-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Server className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm truncate">{ci.custom_id}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const getFormComponent = () => {
  switch(activeTab) {
    case 'departments':
      return <DepartamentoForm usus={usus}/>;
    case 'buildings':
      return       <EdificioForm deps={departamentos} usus={usus}/>;
    case 'rooms':
      return <AulaForm 
      edificios={edificios} 
      deps={departamentos} 
      usus={usus} 
      elementos={elementos}
      />;
    default:
      return null;
  }
};


return (
  <div className="p-6 max-w-[1100px] w-full mx-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Gestión de Infraestructura</h1>
      <p className="text-gray-600">Sistema de Gestión ITIL - Universidad</p>
    </div>

    <Tabs defaultValue="departments" onValueChange={setActiveTab} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Departamentos
          </TabsTrigger>
          <TabsTrigger value="buildings" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Edificios
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />
            Aulas
          </TabsTrigger>
        </TabsList>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo</DialogTitle>
            </DialogHeader>
            {getFormComponent()}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <TabsContent value="departments" className="m-0">
        <DepartmentsView />
      </TabsContent>

      <TabsContent value="buildings" className="m-0">
        <BuildingsView />
      </TabsContent>

      <TabsContent value="rooms" className="m-0">
        <RoomsView />
      </TabsContent>
    </Tabs>
  </div>
);
};


export default InfrastructureManager;