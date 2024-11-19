// app/api/data/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const edificios = await prisma.edificio.findMany();
    const departamentos = await prisma.departamento.findMany();
    const usuarios = await prisma.usuarios.findMany();
    
    const computadoras = await prisma.computadoras.findMany();
    const impresoras = await prisma.impresoras.findMany();
    const proyectores = await prisma.proyectores.findMany();
    
    const aparatos = {
      computadora: computadoras.map(c => ({ id: c.id, custom_id: c.custom_id })),
      impresora: impresoras.map(i => ({ id: i.id, custom_id: i.custom_id })),
      proyector: proyectores.map(p => ({ id: p.id, custom_id: p.custom_id })),
    };
    
    return NextResponse.json({ edificios, departamentos, usuarios, aparatos });
  } catch (error) {
    return NextResponse.error();
  }
}
