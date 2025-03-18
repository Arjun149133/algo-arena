/*
  Warnings:

  - A unique constraint covering the columns `[language]` on the table `BoilerPlate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[input]` on the table `TestCase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BoilerPlate_language_key" ON "BoilerPlate"("language");

-- CreateIndex
CREATE UNIQUE INDEX "TestCase_input_key" ON "TestCase"("input");
