import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  subDays,
  startOfDay,
  endOfDay,
  parse,
} from "date-fns";

export const generateLabels = (
  period: "day" | "month",
  range: number
): string[] => {
  const labels: string[] = [];
  const today = new Date();

  for (let i = range - 1; i >= 0; i--) {
    if (period === "month") {
      labels.push(format(subMonths(today, i), "MMM yyyy"));
    } else if (period === "day") {
      labels.push(format(subDays(today, i), "dd MMM"));
    }
  }

  return labels;
};

export const getStartDate = (period: "month" | "day", label: string) => {
  let startDate: Date;
  if (period === "month") {
    const date = parse(label, "MMM yyyy", new Date());
    startDate = startOfMonth(date);
  } else {
    const date = parse(label, "dd MMM", new Date());
    startDate = startOfDay(date);
  }

  return startDate;
};

export const getEndtDate = (period: "month" | "day", label: string) => {
  let endDate: Date;
  if (period === "month") {
    const date = parse(label, "MMM yyyy", new Date());
    endDate = endOfMonth(date);
  } else {
    const date = parse(label, "dd MMM", new Date());
    endDate = endOfDay(date);
  }

  return endDate;
};
