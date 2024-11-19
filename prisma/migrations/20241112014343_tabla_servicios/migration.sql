-- DropForeignKey
ALTER TABLE "reportes" DROP CONSTRAINT "reportes_aulaid_fkey";

-- DropForeignKey
ALTER TABLE "reportes" DROP CONSTRAINT "reportes_creadorid_fkey";

-- DropForeignKey
ALTER TABLE "reportes" DROP CONSTRAINT "reportes_elementoid_fkey";

-- DropForeignKey
ALTER TABLE "reportes" DROP CONSTRAINT "reportes_tecnicoasignadoid_fkey";

-- AlterTable
ALTER TABLE "reportes" ADD COLUMN     "fecha_limite_resolucion" TIMESTAMP(6),
ADD COLUMN     "fecha_limite_respuesta" TIMESTAMP(6),
ADD COLUMN     "servicioid" INTEGER;

-- CreateTable
CREATE TABLE "categoria_servicio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categoria_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoriaid" INTEGER NOT NULL,
    "tiempo_respuesta" INTEGER NOT NULL,
    "tiempo_resolucion" INTEGER NOT NULL,
    "horario_servicio" VARCHAR(50) NOT NULL,
    "nivel_prioridad" VARCHAR(20) NOT NULL,
    "impacto" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoria_servicio_nombre_key" ON "categoria_servicio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_nombre_key" ON "servicio"("nombre");

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_categoriaid_fkey" FOREIGN KEY ("categoriaid") REFERENCES "categoria_servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_aulaid_fkey" FOREIGN KEY ("aulaid") REFERENCES "aula"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_creadorid_fkey" FOREIGN KEY ("creadorid") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_tecnicoasignadoid_fkey" FOREIGN KEY ("tecnicoasignadoid") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_elementoid_fkey" FOREIGN KEY ("elementoid") REFERENCES "elementos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_servicioid_fkey" FOREIGN KEY ("servicioid") REFERENCES "servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
