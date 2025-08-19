"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { read, utils } from "xlsx";
import { parse } from "date-fns";

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

    console.log({
      rows,
    });

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
        date,
      };
    });

    console.log({
      transactions,
    });

    //     await prisma.transactions.createMany({
    //   data: [{

    //   }],
    //   skipDuplicates: true, // evita duplicados se já existir
    // });

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
