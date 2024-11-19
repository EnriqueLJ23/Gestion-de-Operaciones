
export const authConfig = {
    pages: {
      signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
          const isLoggedIn = !!auth?.user;

          const publicRoutes = ['/login'];
          const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    
          if (isPublicRoute) {
            return true;
          }

          if (isLoggedIn) {
            return true;
          }

          return false; // Esto redirigirá a la página de login
        },
      },
      providers: [],
  }