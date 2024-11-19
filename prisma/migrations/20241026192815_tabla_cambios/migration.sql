-- AlterTable
ALTER TABLE "reportes" ADD COLUMN     "elementoid" INTEGER;

-- CreateTable
CREATE TABLE "cambios" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "prioridad" VARCHAR(20) NOT NULL,
    "impacto" VARCHAR(20) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPlanificada" TIMESTAMP(3),
    "fechaImplementacion" TIMESTAMP(3),
    "fechaCierre" TIMESTAMP(3),
    "solicitanteid" INTEGER,
    "aprobadorid" INTEGER,
    "implementadorid" INTEGER,
    "elementoid" INTEGER,
    "reporteid" INTEGER,
    "analisisImpacto" TEXT,
    "analisisRiesgo" TEXT,
    "planRollback" TEXT,
    "resultadoPruebas" TEXT,
    "resultadoImplementacion" TEXT,
    "notasCierre" TEXT,

    CONSTRAINT "cambios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_elementoid_fkey" FOREIGN KEY ("elementoid") REFERENCES "elementos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cambios" ADD CONSTRAINT "cambios_solicitanteid_fkey" FOREIGN KEY ("solicitanteid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cambios" ADD CONSTRAINT "cambios_aprobadorid_fkey" FOREIGN KEY ("aprobadorid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cambios" ADD CONSTRAINT "cambios_implementadorid_fkey" FOREIGN KEY ("implementadorid") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cambios" ADD CONSTRAINT "cambios_elementoid_fkey" FOREIGN KEY ("elementoid") REFERENCES "elementos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cambios" ADD CONSTRAINT "cambios_reporteid_fkey" FOREIGN KEY ("reporteid") REFERENCES "reportes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
