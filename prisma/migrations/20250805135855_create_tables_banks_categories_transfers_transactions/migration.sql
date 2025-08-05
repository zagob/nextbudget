-- CreateEnum
CREATE TYPE "nextbudget"."BANKS" AS ENUM ('BANCO_DO_BRASIL', 'ITAU', 'ITI', 'PICPAY', 'NUBANK', 'BRADESCO', 'SANTANDER', 'CAIXA', 'INTER', 'C6', 'PAGSEGURO', 'MERCADOPAGO', 'STONE', 'GETNET', 'SAFRA', 'BANRISUL', 'SICOOB', 'SICREDI', 'OUTROS');

-- CreateEnum
CREATE TYPE "nextbudget"."Type" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "nextbudget"."account_banks" (
    "id" TEXT NOT NULL,
    "bank" "nextbudget"."BANKS" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "account_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nextbudget"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "nextbudget"."Type" NOT NULL DEFAULT 'EXPENSE',
    "color" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nextbudget"."transactions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "nextbudget"."Type" NOT NULL DEFAULT 'EXPENSE',
    "accountBankId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nextbudget"."transfers" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "sourceBankId" TEXT NOT NULL,
    "destinationBankId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nextbudget"."account_banks" ADD CONSTRAINT "account_banks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nextbudget"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextbudget"."categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nextbudget"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextbudget"."transactions" ADD CONSTRAINT "transactions_accountBankId_fkey" FOREIGN KEY ("accountBankId") REFERENCES "nextbudget"."account_banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextbudget"."transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "nextbudget"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextbudget"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nextbudget"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextbudget"."transfers" ADD CONSTRAINT "transfers_sourceBankId_fkey" FOREIGN KEY ("sourceBankId") REFERENCES "nextbudget"."account_banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextbudget"."transfers" ADD CONSTRAINT "transfers_destinationBankId_fkey" FOREIGN KEY ("destinationBankId") REFERENCES "nextbudget"."account_banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextbudget"."transfers" ADD CONSTRAINT "transfers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nextbudget"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
