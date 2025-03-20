-- DropForeignKey
ALTER TABLE "ProblemAttempt" DROP CONSTRAINT "ProblemAttempt_userId_fkey";

-- CreateTable
CREATE TABLE "TokenTestCase" (
    "id" TEXT NOT NULL,

    CONSTRAINT "TokenTestCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProblemAttempt" ADD CONSTRAINT "ProblemAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
