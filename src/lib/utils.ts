import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformToCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export function transformToCents(value: string) {
  const cleaned = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleaned);

  return Math.round(parsed * 100);
}

export function validationInputAmount(value: string) {
  const cleaned = value.replace(/\D/g, "");

  const numeric = cleaned === "" ? "0" : cleaned;

  const centavos = parseInt(numeric, 10);

  const formatted = (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  return formatted;
}

export function formatAmountNegative(value: string) {
  return value.replace("-", "- ");
}
