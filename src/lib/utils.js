import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Currency formatting utilities
export const CURRENCY = "PKR";
export const CURRENCY_SYMBOL = "PKR";

export function formatCurrency(amount, options = {}) {
  const value = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const formatted = value.toLocaleString('en-PK', {
    minimumFractionDigits: options.decimals ?? 0,
    maximumFractionDigits: options.decimals ?? 2,
  });
  return `${CURRENCY_SYMBOL} ${formatted}`;
}

export function formatNumber(value) {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  return num.toLocaleString('en-PK');
}

import { format } from "date-fns";

export function formatDate(date, formatStr = "DD/MM/YYYY") {
  if (!date) return "";

  const formats = {
    "DD/MM/YYYY": "dd/MM/yyyy",
    "MM/DD/YYYY": "MM/dd/yyyy",
    "YYYY-MM-DD": "yyyy-MM-dd",
  };

  const pattern = formats[formatStr] || "dd/MM/yyyy";

  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return date;
    return format(d, pattern);
  } catch (error) {
    return date;
  }
}
