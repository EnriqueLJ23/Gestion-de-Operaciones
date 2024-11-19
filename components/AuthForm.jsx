'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/app/actions/auth'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function SignupForm() {
  const [state, action] = useFormState(authenticate, undefined)

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Ingresa tu usuario y contraseña para ingresar a la pagina
        </CardDescription>
      </CardHeader>
      <CardContent>
          <form action={action} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Usuario</Label>
              <Input id="name" name="username" placeholder="Boy meets Girl" required />
            </div>
          
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton />
          </form>
      </CardContent>
    </Card>



  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit" className="w-full">
      Login
    </Button>
  )
}