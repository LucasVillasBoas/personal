/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transfers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transfers" DROP CONSTRAINT "Transfers_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Transfers" DROP CONSTRAINT "Transfers_toId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Transactions";

-- DropTable
DROP TABLE "Transfers";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "EnumStatusAccount";

-- DropEnum
DROP TYPE "StatementType";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "senhaLogin" VARCHAR(45) NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "telefone" VARCHAR(12) NOT NULL,
    "dataNasc" TIMESTAMP(3) NOT NULL,
    "senhaTransacional" VARCHAR(45) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conta" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "agencia" VARCHAR(4) NOT NULL,
    "conta" VARCHAR(6) NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "favorecido" VARCHAR(45) NOT NULL,
    "instituicao" VARCHAR(45) NOT NULL,
    "tipo" VARCHAR(45) NOT NULL,
    "metodo" VARCHAR(45) NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "id" SERIAL NOT NULL,
    "contaID" INTEGER NOT NULL,
    "contaIdDestino" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "agenciaDestino" VARCHAR(4) NOT NULL,
    "contaDestino" VARCHAR(6) NOT NULL,
    "descricao" TEXT,
    "Status" TEXT NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "logradouro" VARCHAR(45) NOT NULL,
    "numero" VARCHAR(5) NOT NULL,
    "bairro" VARCHAR(45) NOT NULL,
    "cidade" VARCHAR(45) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "complemento" VARCHAR(100),

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Conta" ADD CONSTRAINT "Conta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_contaID_fkey" FOREIGN KEY ("contaID") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
