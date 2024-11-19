'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Printer,LaptopMinimal , Projector } from 'lucide-react';

export default function NavCI () {
    const pathname = usePathname()
    return (
        <>
        <nav
          className="grid gap-4 justify-center text-sm text-muted-foreground">
          <Link href="/configuraciones/computadoras" 
                className={`flex gap-1 font-semibold ${pathname ==='/configuraciones/computadoras' ? 'text-primary' : ''}`}
          >
            <LaptopMinimal />
            Computadoras
          </Link>
          <Link href="/configuraciones/proyectores"
                className={`flex gap-1 font-semibold ${pathname ==='/configuraciones/proyectores' ? 'text-primary' : ''}`}
          >
            <Projector />
            Proyectores</Link>
          <Link href="/configuraciones/impresoras"
                className={`flex gap-1 font-semibold ${pathname ==='/configuraciones/impresoras' ? 'text-primary' : ''}`}
          >
            <Printer />
            Impresoras</Link>
        </nav>
        </>
    )
}