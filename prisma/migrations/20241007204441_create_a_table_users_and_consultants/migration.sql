/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `position_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `srcCert` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeKey" AS ENUM ('CPF', 'TELEFONE', 'EMAIL', 'CHAVE_ALEATORIA');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENTE');

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_position_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
DROP COLUMN "position_id",
DROP COLUMN "srcCert",
DROP COLUMN "status",
ADD COLUMN     "passwordResetTime" TEXT,
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENTE';

-- DropTable
DROP TABLE "positions";

-- CreateTable
CREATE TABLE "consultants" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "srcPhoto" TEXT,
    "srcCert" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inativo',
    "pix" TEXT NOT NULL,
    "typeKeyPix" "TypeKey" NOT NULL,
    "totalBilled" DECIMAL(65,30) NOT NULL,
    "availableValue" DECIMAL(65,30) NOT NULL,
    "lockedValue" DECIMAL(65,30) NOT NULL,
    "passwordResetToken" TEXT,
    "passwordResetTime" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consultants_email_key" ON "consultants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "consultants_cpf_key" ON "consultants"("cpf");
