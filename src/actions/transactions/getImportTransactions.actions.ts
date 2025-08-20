"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { read, utils } from "xlsx";

interface GetImportTransactionsProps {
  file: File;
}

export async function getImportTransactions({
  file,
}: GetImportTransactionsProps) {
  try {
    const userId = await getUserAuth();

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = utils.sheet_to_json(worksheet, { defval: null });

    function parseDDMMYYYY(dateStr: string) {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // mês é zero-based
    }

    const transactions = rows.map((row: any) => {
      const date = parseDDMMYYYY(row["date"]);

      return {
        userId,
        description: row["description"],
        amount: Number(row["amount"]),
        type: row["type"],
        bank: row["bank"],
        category: row["category"],
        date,
      };
    });

    const accountBanks = await prisma.accountBanks.findMany({
      where: { userId },
      select: { id: true, bank: true, amount: true },
    });

    const categories = await prisma.categories.findMany({
      where: { userId },
      select: { id: true, name: true },
    });

    const operations = [];

    for (const tx of transactions) {
      const accountBank = accountBanks.find((b) => b.bank === tx.bank);
      const category = categories.find((c) => c.name === tx.category);

      if (!accountBank) {
        throw new Error(`Conta bancária não encontrada: ${tx.bank}`);
      }

      // Atualizar saldo
      const newAmount =
        tx.type === "EXPENSE"
          ? accountBank.amount - tx.amount
          : accountBank.amount + tx.amount;

      operations.push(
        prisma.accountBanks.update({
          where: { id: accountBank.id, userId },
          data: { amount: newAmount },
        })
      );

      operations.push(
        prisma.transactions.create({
          data: {
            userId,
            accountBankId: accountBank.id,
            description: tx.description,
            amount: tx.amount,
            type: tx.type,
            date: tx.date,
            categoryId: category?.id || "",
          },
        })
      );

      // manter o saldo atualizado localmente para não sobrescrever errado
      accountBank.amount = newAmount;
    }

    // await prisma.transactions.createMany({
    //   data: operations,
    //   skipDuplicates: true, // evita duplicados se já existir
    // });

    await prisma.$transaction(operations);

    return {
      success: true,
      message: `${transactions.length} transações importadas com sucesso!`,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get import transactions",
    };
  }
}
