/*
  Warnings:

  - You are about to drop the `Conta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Endereco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transferencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conta" DROP CONSTRAINT "Conta_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Transferencia" DROP CONSTRAINT "Transferencia_contaID_fkey";

-- DropTable
DROP TABLE "Conta";

-- DropTable
DROP TABLE "Endereco";

-- DropTable
DROP TABLE "Transferencia";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(12) NOT NULL,
    "date_birth" DATE NOT NULL,
    "password_login" VARCHAR(45) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Address" (
    "id_address" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "zip_code" VARCHAR(8) NOT NULL,
    "street" VARCHAR(45) NOT NULL,
    "number" VARCHAR(7) NOT NULL,
    "complement" VARCHAR(100) NOT NULL,
    "neighborhood" VARCHAR(45) NOT NULL,
    "city" VARCHAR(45) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id_address")
);

-- CreateTable
CREATE TABLE "Account" (
    "id_account" SERIAL NOT NULL,
    "user_id_user" INTEGER NOT NULL,
    "account_branch" VARCHAR(4) NOT NULL,
    "account_number" VARCHAR(6) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(45) NOT NULL,
    "password_transaction" VARCHAR(45) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id_account")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id_transfer" SERIAL NOT NULL,
    "id_account_origin" INTEGER NOT NULL,
    "id_account_destiny" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(45) NOT NULL,
    "description" VARCHAR(45) NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id_transfer")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_user_fkey" FOREIGN KEY ("user_id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_id_account_origin_fkey" FOREIGN KEY ("id_account_origin") REFERENCES "Account"("id_account") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_id_account_destiny_fkey" FOREIGN KEY ("id_account_destiny") REFERENCES "Account"("id_account") ON DELETE RESTRICT ON UPDATE CASCADE;
