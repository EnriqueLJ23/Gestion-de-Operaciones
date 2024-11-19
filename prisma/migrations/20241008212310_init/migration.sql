-- CreateTable
CREATE TABLE "administradores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30),
    "departamentoid" INTEGER,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aula" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "edificioid" INTEGER,
    "responsable" INTEGER,

    CONSTRAINT "aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "computadoras" (
    "id" SERIAL NOT NULL,
    "fechadecompra" DATE,
    "aulaid" INTEGER,
    "marca" VARCHAR(30),
    "modelo" VARCHAR(30),
    "tipo" VARCHAR(30),
    "cpu" VARCHAR(20),
    "ram" INTEGER,
    "almacenamiento" VARCHAR(30),
    "softwareinstalado" VARCHAR(255),
    "sistemaoperativo" VARCHAR(30),
    "fechadeultimocambio" TIMESTAMP(6),
    "autordeultimocambio" INTEGER,

    CONSTRAINT "computadoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" SERIAL NOT NULL,
    "reporteid" INTEGER,
    "tecnicoid" INTEGER,
    "fechadeconsulta" TIMESTAMP(6),
    "notasdeconsulta" VARCHAR(1000),

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamento" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "encargadoId" INTEGER,

    CONSTRAINT "departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edificio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "departamentoid" INTEGER,
    "encargado" INTEGER,

    CONSTRAINT "edificio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impresoras" (
    "id" SERIAL NOT NULL,
    "fechadecompra" DATE,
    "aulaid" INTEGER,
    "marca" VARCHAR(255),
    "modelo" VARCHAR(255),
    "hojasimpresas" INTEGER,
    "niveldetinta" INTEGER,
    "fechadeultimocambio" TIMESTAMP(6),
    "autorultimocambio" INTEGER,

    CONSTRAINT "impresoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyectores" (
    "id" SERIAL NOT NULL,
    "fechadecompra" DATE,
    "aulaid" INTEGER,
    "marca" VARCHAR(255),
    "modelo" VARCHAR(255),
    "horasdeuso" INTEGER,
    "fechadeultimocambio" TIMESTAMP(6),
    "autorultimocambio" INTEGER,

    CONSTRAINT "proyectores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id" SERIAL NOT NULL,
    "creador" INTEGER,
    "fechadecreacion" TIMESTAMP(6),
    "aulaid" INTEGER,
    "descripcion" TEXT,
    "tecnicoasignado" INTEGER,
    "prioridad" VARCHAR(20),
    "estado" VARCHAR(255),

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tecnicos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30),
    "especialidad" VARCHAR(30),

    CONSTRAINT "tecnicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50),
    "departamentoid" INTEGER,
    "rol" VARCHAR(40),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departamento_nombre_key" ON "departamento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "departamento_encargadoId_key" ON "departamento"("encargadoId");

-- CreateIndex
CREATE UNIQUE INDEX "edificio_nombre_key" ON "edificio"("nombre");

-- AddForeignKey
ALTER TABLE "administradores" ADD CONSTRAINT "administradores_departamentoid_fkey" FOREIGN KEY ("departamentoid") REFERENCES "departamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_edificioid_fkey" FOREIGN KEY ("edificioid") REFERENCES "edificio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_responsable_fkey" FOREIGN KEY ("responsable") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "computadoras" ADD CONSTRAINT "computadoras_aulaid_fkey" FOREIGN KEY ("aulaid") REFERENCES "aula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "computadoras" ADD CONSTRAINT "computadoras_autordeultimocambio_fkey" FOREIGN KEY ("autordeultimocambio") REFERENCES "tecnicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_reporteid_fkey" FOREIGN KEY ("reporteid") REFERENCES "reportes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_tecnicoid_fkey" FOREIGN KEY ("tecnicoid") REFERENCES "tecnicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "departamento" ADD CONSTRAINT "departamento_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edificio" ADD CONSTRAINT "edificio_departamentoid_fkey" FOREIGN KEY ("departamentoid") REFERENCES "departamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "edificio" ADD CONSTRAINT "edificio_encargado_fkey" FOREIGN KEY ("encargado") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "impresoras" ADD CONSTRAINT "impresoras_aulaid_fkey" FOREIGN KEY ("aulaid") REFERENCES "aula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "impresoras" ADD CONSTRAINT "impresoras_autorultimocambio_fkey" FOREIGN KEY ("autorultimocambio") REFERENCES "tecnicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectores" ADD CONSTRAINT "proyectores_aulaid_fkey" FOREIGN KEY ("aulaid") REFERENCES "aula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectores" ADD CONSTRAINT "proyectores_autorultimocambio_fkey" FOREIGN KEY ("autorultimocambio") REFERENCES "tecnicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_aulaid_fkey" FOREIGN KEY ("aulaid") REFERENCES "aula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_creador_fkey" FOREIGN KEY ("creador") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_tecnicoasignado_fkey" FOREIGN KEY ("tecnicoasignado") REFERENCES "tecnicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_departamentoid_fkey" FOREIGN KEY ("departamentoid") REFERENCES "departamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
