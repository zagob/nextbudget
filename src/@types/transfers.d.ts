
export type TransferType = {
    id: string;
    date: Date;
    sourceBankId: string;
    destinationBankId: string;
    amount: number;
    description?: string;
}
export type CreateTransferType = {
  date: Date;
  sourceBankId: string
  destinationBankId: string
  amount: number;
  description?: string;
};
