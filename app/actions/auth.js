"use server"
import { SignupFormSchema } from "@/lib/definitions"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(state, formData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  const { username, password } = validatedFields.data

  try {
    await signIn('credentials', {username: username, password: password,redirectTo:"/incidencias"})

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}