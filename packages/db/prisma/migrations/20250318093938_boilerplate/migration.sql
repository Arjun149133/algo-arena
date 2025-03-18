-- CreateTable
CREATE TABLE "BoilerPlate" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'PYTHON',
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoilerPlate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoilerPlate" ADD CONSTRAINT "BoilerPlate_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
