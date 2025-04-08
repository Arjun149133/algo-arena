-- DropForeignKey
ALTER TABLE "ProblemAttempt" DROP CONSTRAINT "ProblemAttempt_problemId_fkey";

-- AddForeignKey
ALTER TABLE "ProblemAttempt" ADD CONSTRAINT "ProblemAttempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("title") ON DELETE RESTRICT ON UPDATE CASCADE;
