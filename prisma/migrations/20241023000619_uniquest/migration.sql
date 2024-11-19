/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `aula` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "aula_nombre_key" ON "aula"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nombre_key" ON "usuarios"("nombre");
