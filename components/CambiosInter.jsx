'use client'
import React, { useState } from 'react';
import { Calendar, Clock, Filter, Plus, Search, AlertTriangle, CheckCircle, XCircle, History, MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import ChangeCard from './ChangeCard';
const ChangeManagementDashboard = ({ cambios }) => {
  const [selectedTab, setSelectedTab] = useState('todos');
  // Calculate statistics
  const totalChanges = cambios.length;
  const pendingChanges = cambios.filter(change => change.estado === 'Pendiente').length;
  const completedChanges = cambios.filter(change => change.estado === 'Completado').length;
  const emergencyChanges = cambios.filter(change => change.tipo === 'Emergencia').length;

  return (
    <div className="p-6 max-w-[1100px] w-full mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Cambios</h1>
          <p className="text-gray-500">Administra y supervisa los cambios en la infraestructura IT</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Cambios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChanges}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingChanges}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedChanges}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Emergencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{emergencyChanges}</div>
          </CardContent>
        </Card>
      </div>


      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar cambios..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Fecha
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {['Todos', 'Pendiente', 'Autorizados', 'Rechazados', 'Completados'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab.toLowerCase())}
            className={`px-4 py-2 -mb-px ${selectedTab === tab.toLowerCase()
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {cambios.map((change) => (
  <ChangeCard key={change.id} change={change} />
))}
    </div>
  );
};
export default ChangeManagementDashboard;