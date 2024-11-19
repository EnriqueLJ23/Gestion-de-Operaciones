'use client'
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { AlertCircle, Package, MapPin, Clock, CheckCircle, Search, Users, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { ReporteForm } from '@/app/(with-nav)/incidencias/FormIncidencias';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AdminIncidentesUI from './AdminIncidentesUI';
import IncidentesUI from './IncidentesUI';
import TecnicoIncidencias from './TecnicoIncidencias';

// Componente principal que puede alternar entre vistas
const IncidentManagementNormal = ({ edificio, departamento, incidencias, aulas, elementos, session, servicio, userRole = 'admin' }) => {
  return (
    <div>
      {userRole === 'user'
        ? <AdminIncidentesUI
          session={session}
          aulas={aulas}
          edificio={edificio}
          elementos={elementos}
          servicio={servicio}
          incidencias={incidencias}
          departamento={departamento}
        />
        : userRole === 'usuario' ? <IncidentesUI
          session={session}
          aulas={aulas}
          edificio={edificio}
          elementos={elementos}
          servicio={servicio}
          incidencias={incidencias}
          departamento={departamento}
        /> : <TecnicoIncidencias   session={session}
        aulas={aulas}
        edificio={edificio}
        elementos={elementos}
        servicio={servicio}
        incidencias={incidencias}
        departamento={departamento}/>}
    </div>
  );
};

export default IncidentManagementNormal;
