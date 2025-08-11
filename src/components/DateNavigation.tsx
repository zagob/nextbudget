"use client"

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDateOnly, useDateStore } from "@/store/date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "lucide-react";

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i), "MMMM", { locale: ptBR })
);

export const DateNavigation = () => {
  const date = useDateOnly();
  const setDate = useDateStore((state) => state.setDate);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <div className="w-[110px] h-9 bg-neutral-800/50 border border-neutral-600/50 rounded-lg animate-pulse"></div>
        <div className="w-[100px] h-9 bg-neutral-800/50 border border-neutral-600/50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const selectedMonth = date.getMonth();
  const selectedYear = date.getFullYear();

  const handleMonthChange = (value: string) => {
    const newDate = new Date(selectedYear, Number(value));
    setDate(newDate);
  };

  const handleYearChange = (value: string) => {
    const newDate = new Date(Number(value), selectedMonth);
    setDate(newDate);
  };

  return (
    <div className="flex gap-2">
      <Select value={String(selectedMonth)} onValueChange={handleMonthChange}>
        <SelectTrigger
          size="sm"
          className="w-fit capitalize text-start bg-neutral-800/60 border-neutral-700/50 hover:bg-neutral-700/60 hover:border-neutral-600/70 transition-all duration-200 text-neutral-200"
        >
            <Calendar />
            
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="dark:bg-neutral-800/95 border-neutral-700/50 max-h-[300px] shadow-lg">
          {MONTHS.map((month, idx) => (
            <SelectItem
              key={month}
              value={String(idx)}
              className="capitalize hover:bg-neutral-700/50 text-neutral-200"
            >
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(selectedYear)} onValueChange={handleYearChange}>
        <SelectTrigger
          size="sm"
          className="w-[110px] text-start bg-neutral-800/60 border-neutral-700/50 hover:bg-neutral-700/60 hover:border-neutral-600/70 transition-all duration-200 text-neutral-200"
        >
            <Calendar />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="dark:bg-neutral-800/95 border-neutral-700/50 max-h-[300px] shadow-lg">
          {years.map((year) => (
            <SelectItem
              key={year}
              value={String(year)}
              className="hover:bg-neutral-700/50 text-neutral-200"
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};