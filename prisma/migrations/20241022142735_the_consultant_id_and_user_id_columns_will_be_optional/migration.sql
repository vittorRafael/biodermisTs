-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_consultantId_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userId_fkey";

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "consultantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "consultants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
