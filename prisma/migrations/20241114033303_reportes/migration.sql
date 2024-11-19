-- AlterTable
ALTER TABLE "reportes" ADD COLUMN     "fecha_resolucion" TIMESTAMP(6),
ADD COLUMN     "requiere_cambios" BOOLEAN DEFAULT false,
ADD COLUMN     "solucion" TEXT;
