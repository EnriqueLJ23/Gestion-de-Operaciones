import React from 'react';
import { 
  Laptop, Printer, Projector, Clock, Calendar, HardDrive, 
  Cpu, MemoryStick, MonitorSmartphone, Boxes, Paintbrush, Activity,
  Edit2, Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteDialog from './DeleteDialog';
import { Button } from "@/components/ui/button";

const IconWithTooltip = ({ icon: Icon, label, value }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 text-gray-600">
          <Icon className="h-4 w-4" />
          <span className="text-sm">{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const StatusBadge = ({ status, text }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status}`}>
    {text}
  </span>
);

const CICard = ({ item, deleteCI }) => {
  const getMainIcon = (type) => {
    switch (type) {
      case 'computadora': return Laptop;
      case 'impresora': return Printer;
      case 'proyector': return Projector;
      default: return Boxes;
    }
  };

  const getStatus = (item) => {
    if (item.element_type === 'impresora') {
      if (item.niveldetinta < 20) {
        return { color: 'bg-red-100 text-red-800', text: 'Tinta Crítica' };
      } else if (item.niveldetinta < 40) {
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Tinta Baja' };
      }
    }
    if (item.element_type === 'proyector' && item.horasdeuso) {
      if (item.horasdeuso > 800) {
        return { color: 'bg-red-100 text-red-800', text: 'Mantenimiento Urgente' };
      } else if (item.horasdeuso > 600) {
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Mantenimiento Próximo' };
      }
    }
    return { color: 'bg-green-100 text-green-800', text: 'Operativo' };
  };

  const MainIcon = getMainIcon(item.element_type);
  const status = getStatus(item);
  
  const getAge = (purchaseDate) => {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const diffTime = Math.abs(today - purchase);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${diffYears}a ${diffMonths}m`;
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Columna izquierda - Información principal */}
          <div className="flex items-center gap-3 min-w-[240px]">
            <div className={`p-2 rounded-lg ${status.color} bg-opacity-15`}>
              <MainIcon className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{item.custom_id}</h3>
                <StatusBadge status={status.color} text={status.text} />
              </div>
              <p className="text-sm text-gray-600">{item.marca} {item.modelo}</p>
              <p className="text-xs text-gray-500">Aula {item.aula}</p>
            </div>
          </div>

          {/* Columna central - Métricas específicas por tipo */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
            {item.element_type === 'computadora' && (
              <>
                <IconWithTooltip 
                  icon={Cpu} 
                  label="Procesador" 
                  value={item.cpu || 'No especificado'} 
                />
                <IconWithTooltip 
                  icon={MemoryStick} 
                  label="Memoria RAM" 
                  value={item.ram ? `${item.ram}GB` : 'No especificado'} 
                />
                <IconWithTooltip 
                  icon={HardDrive} 
                  label="Almacenamiento" 
                  value={item.almacenamiento || 'No especificado'} 
                />
                <IconWithTooltip 
                  icon={MonitorSmartphone} 
                  label="Sistema Operativo" 
                  value={item.sistemaoperativo || 'No especificado'} 
                />
              </>
            )}
            
            {item.element_type === 'impresora' && (
              <>
                <IconWithTooltip 
                  icon={Paintbrush} 
                  label="Nivel de Tinta" 
                  value={`${item.niveldetinta}%`} 
                />
                <IconWithTooltip 
                  icon={Activity} 
                  label="Páginas Impresas" 
                  value={item.hojasimpresas?.toLocaleString() || '0'} 
                />
              </>
            )}
            
            {item.element_type === 'proyector' && (
              <>
                <IconWithTooltip 
                  icon={Clock} 
                  label="Horas de Uso" 
                  value={`${item.horasdeuso || 0}h`} 
                />
              </>
            )}
          </div>

          {/* Columna derecha - Información temporal y botones */}
          <div className="flex flex-col justify-between items-end text-xs text-gray-500 min-w-[150px]">
            <div className="flex flex-col items-end">
              <IconWithTooltip 
                icon={Calendar} 
                label="Tiempo en servicio" 
                value={getAge(item.fechadecompra)} 
              />
              <span className="mt-1">Actualizado: {new Date(item.fechadeultimocambio).toLocaleDateString()}</span>
              <span>Por: {item.autorultimocambio?.nombre || 'No asignado'}</span>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit2 className="h-4 w-4" />
              </Button>
              <DeleteDialog data={item.id} deleteTh={deleteCI} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CICard;