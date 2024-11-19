/*
  Warnings:

  - You are about to drop the column `responsable` on the `aula` table. All the data in the column will be lost.
  - You are about to drop the column `autordeultimocambio` on the `computadoras` table. All the data in the column will be lost.
  - You are about to drop the column `encargado` on the `edificio` table. All the data in the column will be lost.
  - You are about to drop the column `autorultimocambio` on the `impresoras` table. All the data in the column will be lost.
  - You are about to drop the column `autorultimocambio` on the `proyectores` table. All the data in the column will be lost.
  - You are about to drop the column `creador` on the `reportes` table. All the data in the column will be lost.
  - You are about to drop the column `tecnicoasignado` on the `reportes` table. All the data in the column will be lost.
  - You are about to drop the column `rol` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `administradores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tecnicos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleid` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "administradores" DROP CONSTRAINT "administradores_departamentoid_fkey";

-- DropForeignKey
ALTER TABLE "aula" DROP CONSTRAINT "aula_responsable_fkey";

-- DropForeignKey
ALTER TABLE "computadoras" DROP CONSTRAINT "computadoras_autordeultimocambio_fkey";

-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_tecnicoid_fkey";

-- DropForeignKey
ALTER TABLE "edificio" DROP CONSTRAINT "edificio_encargado_fkey";

-- DropForeignKey
ALTER TABLE "impresoras" DROP CONSTRAINT "impresoras_autorultimocambio_fkey";

-- DropForeignKey
ALTER TABLE "proyectores" DROP CONSTRAINT "proyectores_autorultimocambio_fkey";

-- DropForeignKey
ALTER TABLE "reportes" DROP CONSTRAINT "reportes_creador_fkey";

-- DropForeignKey
ALTER TABLE "reportes" DROP CONSTRAINT "reportes_tecnicoasignado_fkey";

-- AlterTable
ALTER TABLE "aula" DROP COLUMN "responsable",
ADD COLUMN     "responsableid" INTEGER;

-- AlterTable
ALTER TABLE "computadoras" DROP COLUMN "autordeultimocambio",
ADD COLUMN     "autordeultimocambioid" INTEGER;

-- AlterTable
ALTER TABLE "edificio" DROP COLUMN "encargado",
ADD COLUMN     "encargadoid" INTEGER;

-- AlterTable
ALTER TABLE "impresoras" DROP COLUMN "autorultimocambio",
ADD COLUMN     "autorultimocambioid" INTEGER;

-- AlterTable
ALTER TABLE "proyectores" DROP COLUMN "autorultimocambio",
ADD COLUMN     "autorultimocambioid" INTEGER;

-- AlterTable
ALTER TABLE "reportes" DROP COLUMN "creador",
DROP COLUMN "tecnicoasignado",
ADD COLUMN     "creadorid" INTEGER,
ADD COLUMN     "tecnicoasignadoid" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "rol",
ADD COLUMN     "especialidad" VARCHAR(30),
ADD COLUMN     "roleid" INTEGER NOT NULL;

-- DropTable
DROP TABLE "administradores";

-- DropTable
DROP TABLE "tecnicos";

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(40) NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_nombre_key" ON "role"("nombre");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_responsableid_fkey" FOREIGN KEY ("responsableid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "computadoras" ADD CONSTRAINT "computadoras_autordeultimocambioid_fkey" FOREIGN KEY ("autordeultimocambioid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_tecnicoid_fkey" FOREIGN KEY ("tecnicoid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "edificio" ADD CONSTRAINT "edificio_encargadoid_fkey" FOREIGN KEY ("encargadoid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "impresoras" ADD CONSTRAINT "impresoras_autorultimocambioid_fkey" FOREIGN KEY ("autorultimocambioid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectores" ADD CONSTRAINT "proyectores_autorultimocambioid_fkey" FOREIGN KEY ("autorultimocambioid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_creadorid_fkey" FOREIGN KEY ("creadorid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_tecnicoasignadoid_fkey" FOREIGN KEY ("tecnicoasignadoid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
