'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  CircleUser,
  Menu,
  Settings,
  AlertCircle,
  Building2, 
  Users,
  LayoutDashboard,
  FileChartColumn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { ModeToggle } from './Toggle'

export default function Nav({ rol, username }) {
  const pathname = usePathname()

  const getNavigationLinks = () => {
    if (rol === 'usuario_normal') {
      return [
        { href: '/incidencias', label: 'Incidencias', icon: AlertCircle }
      ]
    }

    let links = [
      { href: '/cambios', label: 'Cambios', icon: LayoutDashboard },
      { href: '/incidencias', label: 'Incidencias', icon: AlertCircle }
    ]

    if (rol === 'administrador') {
      links = [
        ...links,
        { href: '/infraestructura', label: 'Infraestructura', icon: Building2 },
        { href: '/configuraciones', label: 'Configuraciones', icon: Settings },
        { href: '/usuarios', label: 'Usuarios', icon: Users },
        { href: '/reportes', label: 'Reportes', icon: FileChartColumn }
      ]
    }
    
    if (rol === 'jefe_de_taller') {
      links = [
        ...links,
        { href: '/reportes', label: 'Reportes', icon: FileChartColumn }
      ]
    }

    return links
  }

  const navigationLinks = getNavigationLinks()

  const NavLink = ({ href, label, icon: Icon, className = '', onClick = () => {} }) => (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-2 text-sm transition-colors hover:text-primary whitespace-nowrap
        ${pathname === href ? 'text-red-500 font-medium' : 'text-muted-foreground'} ${className}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm">{label}</span>
    </Link>
  )

  return (
    <header className="bg-background sticky top-0 h-16 border-b w-full z-50">
      <div className="flex h-16 items-center px-2 sm:px-4 w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="grid gap-4 py-4">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  className="text-base"
                  onClick={() => {
                    const closeButton = document.querySelector('[data-sheet-close]')
                    if (closeButton) {
                      closeButton.click()
                    }
                  }}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 mr-4 shrink-0">
          <div className="bg-primary p-2 rounded">
            <Settings className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:inline">ITIL System</span>
          <span className="font-bold text-lg sm:hidden">BMG</span>
        </div>

        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto scrollbar-hide flex-grow">
          {navigationLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[100px]">
            {username}
          </span>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut()}>
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}