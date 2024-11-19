'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavInfo () {
    const pathname = usePathname()
    return (
        <>
        <nav
          className="grid gap-4 text-sm text-muted-foreground">
          <Link href="/infraestructura/departamentos" 
                className={`font-semibold ${pathname ==='/infraestructura/departamentos' ? 'text-primary' : ''}`}
          >
            Departamentos
          </Link>
          <Link href="/infraestructura/edificios"
                className={`font-semibold ${pathname ==='/infraestructura/edificios' ? 'text-primary' : ''}`}
          >Edificios</Link>
          <Link href="/infraestructura/aulas"
                className={`font-semibold ${pathname ==='/infraestructura/aulas' ? 'text-primary' : ''}`}
          >Aulas</Link>
        </nav>
        </>
    )
}