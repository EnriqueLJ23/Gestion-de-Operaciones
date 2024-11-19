/*
  Warnings:

  - A unique constraint covering the columns `[custom_id]` on the table `computadoras` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[custom_id]` on the table `impresoras` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[custom_id]` on the table `proyectores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "computadoras" ADD COLUMN     "custom_id" VARCHAR(10) NOT NULL DEFAULT 'PC001';

-- AlterTable
ALTER TABLE "impresoras" ADD COLUMN     "custom_id" VARCHAR(10) NOT NULL DEFAULT 'IM001';

-- AlterTable
ALTER TABLE "proyectores" ADD COLUMN     "custom_id" VARCHAR(10) NOT NULL DEFAULT 'PR001';

-- CreateIndex
CREATE UNIQUE INDEX "computadoras_custom_id_key" ON "computadoras"("custom_id");

-- CreateIndex
CREATE UNIQUE INDEX "impresoras_custom_id_key" ON "impresoras"("custom_id");

-- CreateIndex
CREATE UNIQUE INDEX "proyectores_custom_id_key" ON "proyectores"("custom_id");
