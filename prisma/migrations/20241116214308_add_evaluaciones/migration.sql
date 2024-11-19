-- CreateTable
CREATE TABLE "evaluacion_tecnico" (
    "id" SERIAL NOT NULL,
    "reporteid" INTEGER NOT NULL,
    "tecnicoid" INTEGER NOT NULL,
    "calificacion_tecnico" INTEGER NOT NULL,
    "tiempo_respuesta" INTEGER NOT NULL,
    "comentarios" TEXT,
    "fecha_evaluacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntuacion_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "evaluacion_tecnico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "evaluacion_tecnico_reporteid_key" ON "evaluacion_tecnico"("reporteid");

-- CreateIndex
CREATE INDEX "evaluacion_tecnico_tecnicoid_idx" ON "evaluacion_tecnico"("tecnicoid");

-- AddForeignKey
ALTER TABLE "evaluacion_tecnico" ADD CONSTRAINT "evaluacion_tecnico_reporteid_fkey" FOREIGN KEY ("reporteid") REFERENCES "reportes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacion_tecnico" ADD CONSTRAINT "evaluacion_tecnico_tecnicoid_fkey" FOREIGN KEY ("tecnicoid") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
