/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `TokenTestCase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TokenTestCase_tokenId_key" ON "TokenTestCase"("tokenId");
