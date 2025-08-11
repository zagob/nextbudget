import { getResumeByDateTransactions } from "@/actions/transactions/getResumeByDateTransactions.actions";
import { getTransactionsByDate } from "@/actions/transactions/getTransactionsByDate.actions";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useTransactionsData = (date: Date) => {
  const dateFormatted: string = format(date, "yyyy-MM");

  const { data: transactions, isPending: isPendingTransactions } = useQuery({
    queryKey: ["transactions", dateFormatted],
    queryFn: async () => getTransactionsByDate({ date }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  const { data: resume } = useQuery({
    queryKey: ["resumeByDateTransactions", dateFormatted],
    queryFn: async () => getResumeByDateTransactions({ date }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { transactions, resume, isPendingTransactions };
};
