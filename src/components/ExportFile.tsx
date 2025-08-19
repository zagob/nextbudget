import { utils, writeFile } from "xlsx";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { getExportTransactions } from "@/actions/transactions/getExportTransactions.actions";
import { useDateFormatted, useDateOnly } from "@/store/date";

export function ExportFile() {
  const dateFormatted = useDateFormatted();
  const date = useDateOnly();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const transactions = await getExportTransactions({ date });

      const ws = utils.json_to_sheet(transactions.data || []);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, `transactions-${dateFormatted}`);

      writeFile(wb, `transactions-${dateFormatted}.xlsx`);
    },
  });
  return (
    <Button disabled={isPending} variant="outline" onClick={() => mutate()}>
      {isPending ? "Exportando..." : "Exportar CSV"}
    </Button>
  );
}
