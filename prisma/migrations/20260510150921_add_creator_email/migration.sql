-- AlterTable
ALTER TABLE "LovePage" ADD COLUMN     "creatorEmail" TEXT;

-- CreateIndex
CREATE INDEX "LovePage_creatorEmail_idx" ON "LovePage"("creatorEmail");
