/*
  Warnings:

  - You are about to drop the `computadoras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `impresoras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proyectores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "computadoras" DROP CONSTRAINT "computadoras_aulaid_fkey";

-- DropForeignKey
ALTER TABLE "computadoras" DROP CONSTRAINT "computadoras_autordeultimocambioid_fkey";

-- DropForeignKey
ALTER TABLE "impresoras" DROP CONSTRAINT "impresoras_aulaid_fkey";

-- DropForeignKey
ALTER TABLE "impresoras" DROP CONSTRAINT "impresoras_autorultimocambioid_fkey";

-- DropForeignKey
ALTER TABLE "proyectores" DROP CONSTRAINT "proyectores_aulaid_fkey";

-- DropForeignKey
ALTER TABLE "proyectores" DROP CONSTRAINT "proyectores_autorultimocambioid_fkey";

-- DropTable
DROP TABLE "computadoras";

-- DropTable
DROP TABLE "impresoras";

-- DropTable
DROP TABLE "proyectores";

-- CreateTable
CREATE TABLE "elementos" (
    "id" SERIAL NOT NULL,
    "custom_id" VARCHAR(10) NOT NULL,
    "fechadecompra" DATE,
    "aulaid" INTEGER,
    "marca" VARCHAR(255),
    "modelo" VARCHAR(255),
    "fechadeultimocambio" TIMESTAMP(6),
    "autorultimocambioid" INTEGER,
    "element_type" VARCHAR(30) NOT NULL,
    "cpu" VARCHAR(20),
    "ram" INTEGER,
    "almacenamiento" VARCHAR(30),
    "softwareinstalado" VARCHAR(255),
    "sistemaoperativo" VARCHAR(30),
    "hojasimpresas" INTEGER,
    "niveldetinta" INTEGER,
    "horasdeuso" INTEGER,

    CONSTRAINT "elementos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "elementos_custom_id_key" ON "elementos"("custom_id");

-- AddForeignKey
ALTER TABLE "elementos" ADD CONSTRAINT "elementos_aulaid_fkey" FOREIGN KEY ("aulaid") REFERENCES "aula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elementos" ADD CONSTRAINT "elementos_autorultimocambioid_fkey" FOREIGN KEY ("autorultimocambioid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
