-- AlterTable
ALTER TABLE "cambios" ADD COLUMN     "componente_catalogoid" INTEGER;

-- CreateTable
CREATE TABLE "componente_catalogo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "categoria" VARCHAR(20) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "componente_catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "componente_catalogo_nombre_key" ON "componente_catalogo"("nombre");

-- AddForeignKey
ALTER TABLE "cambios" ADD CONSTRAINT "cambios_componente_catalogoid_fkey" FOREIGN KEY ("componente_catalogoid") REFERENCES "componente_catalogo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
