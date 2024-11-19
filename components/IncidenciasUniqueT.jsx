'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog"
import { ArrowLeft,CheckCircle2 } from 'lucide-react';
import { attendIncident, registerSolution } from '@/app/actions/incidencias';
import { registerDiagnosis } from '@/app/actions/incidencias';
import { useToast } from "@/hooks/use-toast"

const IncidenciasUniqueT = ({ incidente, catalogo }) => {
  // Estados principales
  const [ticketStatus, setTicketStatus] = useState(incidente.estado);
  const [showWorkOrderDialog, setShowWorkOrderDialog] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [solution, setSolution] = useState("");
  const [requiresChange, setRequiresChange] = useState(false);
  const [workOrder, setWorkOrder] = useState(incidente.cambios[0] || null);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [workOrderDescription, setWorkOrderDescription] = useState("");
  const { toast } = useToast();
  // Manejador para atender incidencia
  const handleAttendTicket = async () => {
    const result = await attendIncident(incidente.id);
    if (result.success) {
      setTicketStatus("En Diagnostico");
      setShowDiagnosisSection(true);
    } else {
      // Manejar el error
      alert("No se pudo iniciar la atención de la incidencia");
    }
  };


  // En el componente IncidenciasUniqueT
  const handleRegisterDiagnosis = async () => {
    if (!diagnosis.trim()) {
      alert("Por favor, escribe un diagnóstico antes de continuar.");
      return;
    }

    // Si hay una orden de trabajo pendiente, incluir sus datos
    const workOrderData = requiresChange ? {
      titulo: `Solicitud de cambio para: ${incidente.elemento.custom_id}`,
      descripcion: workOrder.descripcion, // Del estado del componente
      componenteid: workOrder.componente, // Del estado del componente
      prioridad: incidente.prioridad,
      impacto: "Medio",
      solicitanteId: incidente.tecnicoasignadoid, // El técnico actual
      elementoId: incidente.elementoid,
      // Puedes agregar más campos según necesites
    } : null;

    const result = await registerDiagnosis({
      incidentId: incidente.id,
      diagnosis,
      requiresChange,
      workOrderData
    });

    if (result.success) {
      toast({
        title: "Actualización exitosa",
        description: "El Diagnostico ha sido registrado.",
        variant: "positive",
    });
      setTicketStatus(requiresChange ? "Esperando Confirmacion" : "En Proceso");
      setShowSolutionSection(!requiresChange);
      setShowDiagnosisSection(false);


      // Si se creó una orden de trabajo, actualizar el estado local
      if (result.data.workOrder) {
        setWorkOrder(result.data.workOrder);
      }
    } else {
      toast({
        title: "Ocurrio un error",
        description: "No se pudo registrar el diagnostico",
        variant: "destructive",
    });
    }
  };
console.log("WOORK ORDERRRRRRRRRR", incidente.cambios);

  // Manejador para registrar solución
  const handleRegisterSolution = async () => {
    if (!solution.trim()) {
      alert("Por favor, escribe la solución implementada antes de continuar.");
      return;
    }

    const result = await registerSolution({
      incidentId: incidente.id,
      solution,
      userId: incidente.tecnicoasignadoid
    });

    if (result.success) {
      toast({
        title: "Actualización exitosa",
        description: "La solucion se ha registrado.",
        variant: "positive",
    });
    setTicketStatus("Resuelto");
    setShowSolutionSection(false);
    } else {
      toast({
        title: "Ocurrio un error",
        description: "No se pudo registrar la solucion",
        variant: "destructive",
    });
    }

  };

  // Manejador para crear orden de trabajo
  const handleCreateWorkOrder = (componente, descripcion) => {
    setWorkOrder({
      id: `WO-${Math.random().toString(36).substr(2, 9)}`,
      componente,
      status: "Pendiente",
      descripcion
    });

  };

  const caty = catalogo.filter(cat => cat.categoria === incidente.elemento.element_type);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Link
        href="/incidencias"
        className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a Incidencias
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">
                #{incidente.id}: {incidente.elemento.custom_id} - {incidente.servicio.nombre}
              </CardTitle>
              <CardDescription>{incidente.descripcion}</CardDescription>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${ticketStatus === "Asignado" ? "bg-blue-100 text-blue-800" :
                ticketStatus === "En Diagnostico" ? "bg-yellow-100 text-yellow-800" :
                  ticketStatus === "En Proceso" ? "bg-orange-100 text-orange-800" :
                    ticketStatus === "Esperando Confirmacion" ? "bg-purple-100 text-purple-800" :
                      ticketStatus === "Resuelto" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
              }`}>
              {ticketStatus}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Detalles del Ticket */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Detalles de la Solicitud</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Prioridad:</span> {incidente.prioridad}</p>
                <p className="text-sm"><span className="font-medium">Categoría:</span> {incidente?.categoria}</p>
                <p className="text-sm"><span className="font-medium">Solicitante:</span> {incidente.creador.nombre}</p>
                <p className="text-sm"><span className="font-medium">Ubicación:</span> {incidente.aula.edificio.departamento.nombre}, Edificio {incidente.aula.edificio.nombre} - {incidente.aula.nombre}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Activos Afectados</h3>
              <div className="space-y-2">
                <p className="text-sm">{incidente.elemento.marca} {incidente.elemento.modelo}</p>
              </div>
            </div>
          </div>

          {/* Botón de Atender Incidencia */}
          {ticketStatus === "Asignado" && <AlertDialog>
            <AlertDialogTrigger asChild><Button>Atender Incidencia</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta accion no se puede deshacer, al confirmar iniciara el proceso.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild><Button onClick={handleAttendTicket}>Confirmar</Button></AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}



          {/* Sección de Diagnóstico */}
          {ticketStatus === "En Diagnostico" && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold mb-4">Diagnóstico</h3>
              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Escribe el diagnóstico del problema..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-3">¿La solución requiere realizar cambios en infraestructura, hardware o software?</p>
                <div className="flex gap-3">
                  <Button
                    variant={requiresChange ? "default" : "outline"}
                    onClick={() => setRequiresChange(true)}
                  >
                    Sí, requiere cambios
                  </Button>


                  <Button
                    variant={!requiresChange ? "default" : "outline"}
                    onClick={() => setRequiresChange(false)}
                  >
                    No, es una solución directa
                  </Button>
                </div>
              </div>
              {/* Mostrar orden de trabajo actual si existe */}
              {workOrder && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Orden de Trabajo #{workOrder.id}</h4>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {workOrder.estado}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Tipo:</span> {workOrder.tipo}</p>
                    <p className="text-sm"><span className="font-medium">Descripción:</span> {workOrder.descripcion}</p>
                  </div>
                  <p className="text-sm text-purple-800">
                    Esperando confirmación del jefe de taller para proceder con los cambios.
                  </p>
                </div>
              )}
              {/* Si requiere cambios: Mostrar orden de trabajo */}
              {requiresChange && !workOrder && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-3">
                    Se requiere crear una orden de trabajo para proceder con los cambios necesarios.
                  </p>
                  <Button
                    onClick={() => setShowWorkOrderDialog(true)}
                    variant="outline"
                  >
                    📋 Crear Orden de Trabajo
                  </Button>
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleRegisterDiagnosis}
                  disabled={!diagnosis.trim()}
                >
                  Registrar Diagnóstico
                </Button>
              </div>
            </div>
          )}

            {/* Mostrar orden de trabajo actual si existe */}
            {(workOrder && ticketStatus === "Esperando Confirmacion") && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Orden de Trabajo #{workOrder.id}</h4>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {workOrder.estado}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Tipo:</span> {workOrder.tipo}</p>
                    <p className="text-sm"><span className="font-medium">Titulo:</span> {workOrder.titulo}</p>
                    <p className="text-sm"><span className="font-medium">Descripción:</span> {workOrder.descripcion}</p>
                  </div>
                  <p className="text-sm text-purple-800">
                    Esperando confirmación del jefe de taller para proceder con los cambios.
                  </p>
                </div>
              )}

                       {/* Mostrar orden de trabajo actual si existe */}
            { (workOrder && ticketStatus === "En Proceso") && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Orden de Trabajo #{workOrder.id}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {workOrder.estado}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Tipo:</span> {workOrder.tipo}</p>
                    <p className="text-sm"><span className="font-medium">Titulo:</span> {workOrder.titulo}</p>
                    <p className="text-sm"><span className="font-medium">Descripción:</span> {workOrder.descripcion}</p>
                  </div>
                  <p className="text-sm text-green-800">
                    Se ha autorizado el cambio del componente.
                  </p>
                </div>
              )}


          {/* Sección de Solución */}
          {(workOrder?.estado === "Aceptado") || (ticketStatus === "En Proceso") && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold mb-4">Solución</h3>
              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Describe la solución implementada..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleRegisterSolution}
                  disabled={!solution.trim()}
                >
                  Registrar Solución
                </Button>
              </div>
            </div>
          )}

{ (workOrder && ticketStatus === "Cancelado") && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Orden de Trabajo #{workOrder.id}</h4>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {workOrder.estado}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Tipo:</span> {workOrder.tipo}</p>
                    <p className="text-sm"><span className="font-medium">Titulo:</span> {workOrder.titulo}</p>
                    <p className="text-sm"><span className="font-medium">Descripción:</span> {workOrder.descripcion}</p>
                  </div>
                  <p className="text-sm text-red-800">
                    Se ha autorizado el cambio del componente.
                  </p>
                </div>
              )}



{ (workOrder && ticketStatus === "Resuelto") && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Orden de Trabajo #{workOrder.id}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {workOrder.estado}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Tipo:</span> {workOrder.tipo}</p>
                    <p className="text-sm"><span className="font-medium">Titulo:</span> {workOrder.titulo}</p>
                    <p className="text-sm"><span className="font-medium">Descripción:</span> {workOrder.descripcion}</p>
                  </div>
                  <p className="text-sm text-green-800">
                    Se ha autorizado el cambio del componente.
                  </p>
                </div>
              )}




{incidente.estado === "Resuelto" && (
                        <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-800">Resolución de Incidencia</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Diagnóstico</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incidente.diagnostico}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Solución</h4>
                                    <p className="bg-white p-4 rounded-lg border border-green-200 text-green-800">
                                        {incidente.solucion}
                                    </p>
                                </div>
                            </div>   
                        </div>
                    )}
        </CardContent>
      </Card>

      {/* Modal de Orden de Trabajo */}
      <AlertDialog open={showWorkOrderDialog} onOpenChange={setShowWorkOrderDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Nueva Orden de Trabajo</AlertDialogTitle>
      <AlertDialogDescription>
        Detalla los cambios que necesitas realizar para resolver el ticket.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <div className="space-y-4 py-4">
      <Select 
        value={selectedComponent} 
        onValueChange={setSelectedComponent}
      >
        <SelectTrigger>
          <SelectValue placeholder="seleccione componente" />
        </SelectTrigger>
        <SelectContent>
          {caty.map(cat => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <textarea
        className="w-full p-2 border rounded-md h-32"
        placeholder="Describe los cambios a realizar y los recursos necesarios..."
        value={workOrderDescription}
        onChange={(e) => setWorkOrderDescription(e.target.value)}
      />
    </div>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction 
        onClick={() => {
          handleCreateWorkOrder(
            selectedComponent,
            workOrderDescription
          );
          setShowWorkOrderDialog(false);
          setSelectedComponent("");
          setWorkOrderDescription("");
        }}
        disabled={!selectedComponent || !workOrderDescription.trim()}
      >
        Crear Orden
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>
  );
};

export default IncidenciasUniqueT;