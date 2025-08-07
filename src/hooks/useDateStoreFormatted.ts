import { useDateStore } from "@/store/date";
import { format } from "date-fns";

export default function useDateStoreFormatted() {
  const date = useDateStore((state) => format(state.date, "yyyy-MM"));
  return date;
}
