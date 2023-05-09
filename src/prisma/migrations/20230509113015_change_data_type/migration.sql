/*
  Warnings:

  - You are about to alter the column `cpf` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `phone` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `password_login` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "updated_at" TIMESTAMP,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(14),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "date_birth" SET DATA TYPE DATE,
ALTER COLUMN "password_login" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP;
