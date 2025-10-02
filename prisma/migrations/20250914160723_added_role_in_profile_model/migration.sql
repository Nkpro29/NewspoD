-- CreateEnum
CREATE TYPE "public"."userRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "role" "public"."userRole" NOT NULL DEFAULT 'USER';
