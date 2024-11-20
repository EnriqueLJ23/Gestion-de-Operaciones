# BMG

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![ShadCN](https://img.shields.io/badge/ShadCN-blueviolet?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)



Sistema de Gestion de Operaciones de TI siguiendo el framework de procesos ITIL.

## Tecnologías Utilizadas
- [Next.js](https://nextjs.org/) - Frontend Framework
- [shadcn](https://ui.shadcn.com/) - Components library
- [Taiwindcss](https://tailwindcss.com/) - Components library
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Containerization


## Comenzando

### Requisitos Previos
- Docker
- Node.js 18.x

### Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/EnriqueLJ23/Gestion-de-Operaciones.git
   cd Gestion-de-Operaciones
   ```
2. Copia el archivo .env.example como .env:
   ```bash
   cp .env.example .env
   ```
3. Completa las variables de entorno en el archivo .env. Ejemplo:
   ```bash
    DATABASE_URL=postgres://postgres:password@db:5432/mydatabase
    AUTH_SECRET=loveslikesuicide
    NEXTAUTH_URL=http://localhost:3000
    AUTH_TRUST_HOST=true
   ```
4. Construye y levanta los contenedores con Docker Compose::
   ```bash
   docker-compose up --build

   ```
5. Accede a la aplicación en http://localhost:3000.

---
