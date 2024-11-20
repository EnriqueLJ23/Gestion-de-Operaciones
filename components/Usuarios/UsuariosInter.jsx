'use client'
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit2, Trash2 } from 'lucide-react';
import DeleteDialog from '../DeleteDialog';
import { FormUsuarios } from '@/app/(with-nav)/usuarios/FormU';
const UserManagement = ({usuarios, departamentos}) => {
  const [users] = useState([
    { id: 1, name: 'Ana García', email: 'ana.garcia@universidad.edu', role: 'administrador', status: 'active' },
    { id: 2, name: 'Gonzalo Gonzales', email: 'carlos.lopez@universidad.edu', role: 'tecnico', status: 'active' },
    { id: 3, name: 'Ramiro Ramirez', email: 'maria.rodriguez@universidad.edu', role: 'usuario_normal', status: 'inactive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const handleDeleteUser = async (userId) => {
    // Implement your delete logic here
    console.log(`Deleting user with ID: ${userId}`);
    return { message: "Usuario eliminado exitosamente" };
  };
  const getRoleBadgeColor = (role) => {
    const colors = {
      administrador: 'bg-purple-100 text-purple-800',
      tecnico: 'bg-blue-100 text-blue-800',
      usuario_normal: 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'Hardware' 
    ? 'bg-yellow-100 text-yellow-800' 
    : status === 'N/A' 
      ? 'bg-pink-100 text-pink-800' 
      : 'bg-orange-100 text-orange-800' ;
  };

  return (
    <div className="p-6 max-w-[1100px] w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Elementos de Configuración</h1>
        <p className="text-gray-600">Sistema de Gestión ITIL - Universidad</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold"></CardTitle>
          <FormUsuarios departamentos={departamentos}/>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nombre}</TableCell>
                    <TableCell>{user.departamento}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.rol)}>
                        {user.rol === 'administrador' && 'Administrador'}
                        {user.rol === 'tecnico' && 'Tecnico'}
                        {user.rol === 'usuario_normal' && 'Usuario'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(user.especialidad)}>
                        {user.especialidad}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <DeleteDialog 
                        data={user}
                        deleteTh={handleDeleteUser}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;