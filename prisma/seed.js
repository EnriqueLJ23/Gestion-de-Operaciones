const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Clean existing data
    await prisma.$transaction([
      prisma.cambios.deleteMany(),
      prisma.evaluacion_tecnico.deleteMany(),
      prisma.consultas.deleteMany(),
      prisma.reportes.deleteMany(),
      prisma.elementos.deleteMany(),
      prisma.aula.deleteMany(),
      prisma.edificio.deleteMany(),
      prisma.usuarios.deleteMany(),
      prisma.departamento.deleteMany(),
      prisma.role.deleteMany(),
    ])

    // 1. Insert roles
    const roles = await prisma.role.createMany({
      data: [
        { nombre: 'administrador', descripcion: 'Control total del sistema' },
        { nombre: 'jefe_de_taller', descripcion: 'Gestión de taller y asignación de tareas' },
        { nombre: 'tecnico', descripcion: 'Realización de trabajos técnicos' },
        { nombre: 'usuario_normal', descripcion: 'Acceso básico al sistema' }
      ]
    })

    // 2. Insert departamentos
    const departamentos = await prisma.departamento.createMany({
      data: [
        { nombre: 'Sistemas' },
        { nombre: 'Industrial' },
        { nombre: 'Gestion' }
      ]
    })

    // 3. Insert edificios
    const edificios = await prisma.edificio.createMany({
      data: [
        { nombre: 'A', departamentoid: 1 },
        { nombre: 'B', departamentoid: 1 },
        { nombre: 'C', departamentoid: 1 },
        { nombre: 'CC', departamentoid: 1 },
        { nombre: 'G', departamentoid: 2 },
        { nombre: 'J', departamentoid: 2 },
        { nombre: 'I', departamentoid: 2 },
        { nombre: 'L', departamentoid: 3 },
        { nombre: 'M', departamentoid: 3 }
      ]
    })

    // 4. Insert aulas
    const aulas = await prisma.aula.createMany({
      data: [
        { nombre: 'EA01', edificioid: 1 },
        { nombre: 'EB02', edificioid: 2 },
        { nombre: 'EB03', edificioid: 2 },
        { nombre: 'EB04', edificioid: 2 },
        { nombre: 'EC01', edificioid: 3 },
        { nombre: 'EC02', edificioid: 3 },
        { nombre: 'EJ02', edificioid: 6 },
        { nombre: 'EJ03', edificioid: 6 },
        { nombre: 'EL01', edificioid: 8 },
        { nombre: 'EL02', edificioid: 8 }
      ]
    })

    // 5. Insert usuarios
    // Usuarios normales
    await prisma.usuarios.createMany({
      data: [
        { nombre: 'Iñigo Montoya', departamentoid: 1, roleid: 4 },
        { nombre: 'Eufemio "El Cochiloco" Mata', departamentoid: 2, roleid: 4 },
        { nombre: 'Christopher Moltisanti', departamentoid: 3, roleid: 4 },
        // Jefe de taller
        { nombre: 'Gonzalo Gonzales', departamentoid: 1, roleid: 2 },
        // Técnicos
        { nombre: 'Roman Roy', roleid: 3, especialidad: 'Hardware' },
        { nombre: 'Kendall Roy', roleid: 3, especialidad: 'Software' },
        { nombre: 'Travis bickle', roleid: 3, especialidad: 'Redes' },
        // Administradores
        { nombre: 'Logan Roy', departamentoid: 1, roleid: 1 },
        { nombre: 'Antonio Soprano', departamentoid: 2, roleid: 1 }
      ]
    })

    // 6. Insert elementos - Computadoras
    await prisma.elementos.createMany({
      data: [
        {
          custom_id: 'PC001',
          fechadecompra: new Date('2023-01-01'),
          aulaid: 2,
          marca: 'Dell',
          modelo: 'XPS 13',
          fechadeultimocambio: new Date('2024-01-01'),
          autorultimocambioid: 1,
          element_type: 'computadora',
          cpu: 'Intel i7',
          ram: 16,
          almacenamiento: '512GB SSD',
          softwareinstalado: 'Office, Chrome',
          sistemaoperativo: 'Windows 10'
        },
        // Add remaining computers...
        {
          custom_id: 'PC002',
          fechadecompra: new Date('2022-05-15'),
          aulaid: 4,
          marca: 'HP',
          modelo: 'Pavilion',
          fechadeultimocambio: new Date('2023-05-15'),
          autorultimocambioid: 2,
          element_type: 'computadora',
          cpu: 'Intel i5',
          ram: 8,
          almacenamiento: '256GB SSD',
          softwareinstalado: 'Chrome, Photoshop',
          sistemaoperativo: 'Windows 10'
        },
        // ... Add remaining computers similarly
      ]
    })

    // 7. Insert elementos - Impresoras
    await prisma.elementos.createMany({
      data: [
        {
          custom_id: 'IM001',
          fechadecompra: new Date('2023-01-20'),
          aulaid: 2,
          marca: 'HP',
          modelo: 'LaserJet',
          fechadeultimocambio: new Date('2024-01-20'),
          autorultimocambioid: 1,
          element_type: 'impresora',
          hojasimpresas: 1000,
          niveldetinta: 80
        },
        // Add remaining printers...
      ]
    })

    // 8. Insert elementos - Proyectores
    await prisma.elementos.createMany({
      data: [
        {
          custom_id: 'PR001',
          fechadecompra: new Date('2022-02-14'),
          aulaid: 2,
          marca: 'Epson',
          modelo: 'PowerLite',
          fechadeultimocambio: new Date('2023-02-14'),
          autorultimocambioid: 1,
          element_type: 'proyector',
          horasdeuso: 500
        },
        // Add remaining projectors...
      ]
    })

    console.log('Database has been seeded. 🌱')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })