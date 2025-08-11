import { format } from "date-fns";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface DateStoreProps {
  date: Date;
  dateFormatted: string;
  setDate: (date: Date) => void;
}

export const useDateStore = create<DateStoreProps>()(
  subscribeWithSelector((set) => ({
    date: new Date(),
    dateFormatted: format(new Date(), "yyyy-MM"),
    setDate: (date: Date) =>
      set({ date, dateFormatted: format(date, "yyyy-MM") }),
  }))
);

export const useDateOnly = () => useDateStore(state => state.date)
export const useDateFormatted = () => useDateStore(state => state.dateFormatted)