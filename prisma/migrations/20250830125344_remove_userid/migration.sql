/*
  Warnings:

  - You are about to drop the column `userId` on the `Episode` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Episode_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "public"."Episode" DROP COLUMN "userId";

-- CreateIndex
CREATE INDEX "Episode_createdAt_idx" ON "public"."Episode"("createdAt");
