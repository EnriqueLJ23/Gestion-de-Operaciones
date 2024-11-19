import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/db';


async function getUser(username){
    try {
        const findUser = await prisma.usuarios.findUnique({
            where: {
                nombre: username
                },
                include: {
                  rol: true, // Include the role in the query
              }
        });
        return findUser
    } catch (error) {
      console.error('Error al buscar el usuario', error);
      throw new Error('Error al buscar el usuario');
    }
  }


export const {handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [ 
    Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ username: z.string().min(2), password: z.string().min(2) })
        .safeParse(credentials);

        if (parsedCredentials.success) {
            const { username, password } = parsedCredentials.data;
            const user = await getUser(username);
            if (!user) return null;
            console.log(user);
            
            return user;
          }

          console.log('Invalid credentials');
          return null;
    },
  }),],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id;
        token.nombre = user.nombre;
        token.role = user.rol.nombre; // Assuming 'rol' contains a field 'nombre'
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
        session.user.role = token.role; // Add the role to the session
      }
      return session;
    },
  }, 
});