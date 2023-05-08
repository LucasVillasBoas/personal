/*
  Warnings:

  - A unique constraint covering the columns `[id_user]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cpf" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "date_birth" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "password_login" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_user_key" ON "User"("id_user");
