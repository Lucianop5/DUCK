import { prisma } from "@/lib/prisma";
import {
  addMonths,
  currentPeriod,
  daysInMonth,
  formatDateShort,
  formatPercent,
  lastNMonths,
  monthLabel,
  monthShortLabel,
  roundMoney,
  roundOne,
  toIsoDate,
  todayInTimeZone,
  type Period,
} from "@/lib/date";
import { listBudgets, type BudgetSummary } from "@/lib/services/budgets";
import type { PaymentMethodValue } from "@/lib/constants/categories";
import type { AnalyticsQuery, SimulatorInput } from "@/lib/validators/analytics";
import { monthRange } from "@/lib/validators/common";

const PAYMENT_LABELS: Record<PaymentMethodValue, string> = {
  CASH: "Efectivo",
  DEBIT: "Débito",
  CREDIT: "Crédito",
  TRANSFER: "Transferencia",
  WALLET: "Billetera digital",
  OTHER: "Otro",
};

export type CategoryBreakdown = {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  total: number;
  count: number;
  percentage: number;
};

export type DailyPoint = {
  date: string;
  day: number;
  label: string;
  total: number;
  count: number;
  cumulative: number;
};

export type MonthlyPoint = {
  year: number;
  month: number;
  label: string;
  total: number;
  count: number;
};

export type FrequentExpense = {
  description: string;
  total: number;
  count: number;
  average: number;
  percentage: number;
};

export type PaymentBreakdown = {
  method: PaymentMethodValue;
  label: string;
  total: number;
  count: number;
  percentage: number;
};

export type MonthAnalytics = {
  period: Period;
  label: string;
  total: number;
  count: number;
  average: number;
  largest: number;
  previous: {
    period: Period;
    label: string;
    total: number;
    difference: number;
    variationPercentage: number | null;
  };
  byCategory: CategoryBreakdown[];
  byPaymentMethod: PaymentBreakdown[];
  daily: DailyPoint[];
  frequent: FrequentExpense[];
  budgets: BudgetSummary[];
  generalBudget: BudgetSummary | null;
};

function percent(part: number, total: number): number {
  return total > 0 ? roundOne((part / total) * 100) : 0;
}

function resolvePeriod(user: { timezone?: string | null }, query: AnalyticsQuery): Period {
  if (query.year && query.month) return { year: query.year, month: query.month };
  const now = currentPeriod(user.timezone ?? "America/Santiago");
  return { year: query.year ?? now.year, month: query.month ?? now.month };
}

export async function getMonthAnalytics(
  userId: string,
  user: { timezone?: string | null },
  query: AnalyticsQuery,
): Promise<MonthAnalytics> {
  const period = resolvePeriod(user, query);
  const previousPeriod = addMonths(period, -1);
  const { from, to } = monthRange(period.year, period.month);
  const previousRange = monthRange(previousPeriod.year, previousPeriod.month);

  const [aggregate, previous, groupedByCategory, groupedByDate, groupedByMethod, frequentRows, budgets] =
    await Promise.all([
      prisma.expense.aggregate({
        where: { userId, date: { gte: from, lte: to } },
        _sum: { amount: true },
        _count: { _all: true },
        _avg: { amount: true },
        _max: { amount: true },
      }),
      prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: previousRange.from, lte: previousRange.to },
        },
        _sum: { amount: true },
      }),
      prisma.expense.groupBy({
        by: ["categoryId"],
        where: { userId, date: { gte: from, lte: to } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.expense.groupBy({
        by: ["date"],
        where: { userId, date: { gte: from, lte: to } },
        _sum: { amount: true },
        _count: { _all: true },
        orderBy: { date: "asc" },
      }),
      prisma.expense.groupBy({
        by: ["paymentMethod"],
        where: { userId, date: { gte: from, lte: to } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.expense.groupBy({
        by: ["description"],
        where: { userId, date: { gte: from, lte: to } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      listBudgets(userId, period),
    ]);

  const total = Number(aggregate._sum.amount ?? 0);
  const count = aggregate._count._all;

  const categoryRows = await prisma.category.findMany({
    where: { userId, id: { in: groupedByCategory.map((row) => row.categoryId) } },
    select: { id: true, name: true, color: true, icon: true },
  });
  const categoryById = new Map(categoryRows.map((row) => [row.id, row]));

  const byCategory: CategoryBreakdown[] = groupedByCategory
    .map((row) => {
      const category = categoryById.get(row.categoryId);
      const categoryTotal = Number(row._sum.amount ?? 0);
      return {
        categoryId: row.categoryId,
        name: category?.name ?? "Sin categoría",
        color: category?.color ?? "#64748B",
        icon: category?.icon ?? "circle",
        total: categoryTotal,
        count: row._count._all,
        percentage: percent(categoryTotal, total),
      };
    })
    .sort((a, b) => b.total - a.total);

  const byPaymentMethod: PaymentBreakdown[] = groupedByMethod
    .map((row) => {
      const methodTotal = Number(row._sum.amount ?? 0);
      return {
        method: row.paymentMethod,
        label: PAYMENT_LABELS[row.paymentMethod],
        total: methodTotal,
        count: row._count._all,
        percentage: percent(methodTotal, total),
      };
    })
    .sort((a, b) => b.total - a.total);

  const dayTotals = new Map(
    groupedByDate.map((row) => [toIsoDate(row.date), Number(row._sum.amount ?? 0)]),
  );
  const dayCounts = new Map(
    groupedByDate.map((row) => [toIsoDate(row.date), row._count._all]),
  );

  let cumulative = 0;
  const daily: DailyPoint[] = Array.from(
    { length: daysInMonth(period.year, period.month) },
    (_, index) => {
      const day = index + 1;
      const iso = `${period.year}-${String(period.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayTotal = dayTotals.get(iso) ?? 0;
      cumulative = roundMoney(cumulative + dayTotal);
      return {
        date: iso,
        day,
        label: formatDateShort(iso),
        total: dayTotal,
        count: dayCounts.get(iso) ?? 0,
        cumulative,
      };
    },
  );

  const frequent: FrequentExpense[] = frequentRows
    .map((row) => {
      const descriptionTotal = Number(row._sum.amount ?? 0);
      return {
        description: row.description,
        total: descriptionTotal,
        count: row._count._all,
        average: roundMoney(descriptionTotal / Math.max(1, row._count._all)),
        percentage: percent(descriptionTotal, total),
      };
    })
    .sort((a, b) => b.count - a.count || b.total - a.total)
    .slice(0, 8);

  const previousTotal = Number(previous._sum.amount ?? 0);
  const difference = roundMoney(total - previousTotal);

  return {
    period,
    label: monthLabel(period.year, period.month),
    total: roundMoney(total),
    count,
    average: roundMoney(Number(aggregate._avg.amount ?? 0)),
    largest: roundMoney(Number(aggregate._max.amount ?? 0)),
    previous: {
      period: previousPeriod,
      label: monthLabel(previousPeriod.year, previousPeriod.month),
      total: roundMoney(previousTotal),
      difference,
      variationPercentage:
        previousTotal > 0 ? roundOne((difference / previousTotal) * 100) : null,
    },
    byCategory,
    byPaymentMethod,
    daily,
    frequent,
    budgets,
    generalBudget: budgets.find((budget) => budget.categoryId === null) ?? null,
  };
}

export type Summary = {
  generatedAt: string;
  period: { year: number; month: number; label: string };
  totalSpent: number;
  expenseCount: number;
  averagePerExpense: number;
  dailyAverage: number;
  previousTotal: number;
  variationPercentage: number | null;
  budget: {
    amount: number;
    spent: number;
    remaining: number;
    percentage: number;
    status: BudgetSummary["status"];
  } | null;
  categories: {
    categoryId: string;
    name: string;
    color: string;
    total: number;
    percentage: number;
  }[];
};

/**
 * Resumen compacto y estable para LifeDashboard.
 * Solo incluye datos del usuario autenticado y cifras ya agregadas.
 */
export async function getSummary(
  userId: string,
  user: { timezone?: string | null },
  query: AnalyticsQuery,
): Promise<Summary> {
  const period = resolvePeriod(user, query);
  const previousPeriod = addMonths(period, -1);
  const { from, to } = monthRange(period.year, period.month);
  const previousRange = monthRange(previousPeriod.year, previousPeriod.month);

  const [aggregate, previous, grouped, budgets] = await Promise.all([
    prisma.expense.aggregate({
      where: { userId, date: { gte: from, lte: to } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.expense.aggregate({
      where: { userId, date: { gte: previousRange.from, lte: previousRange.to } },
      _sum: { amount: true },
    }),
    prisma.expense.groupBy({
      by: ["categoryId"],
      where: { userId, date: { gte: from, lte: to } },
      _sum: { amount: true },
    }),
    listBudgets(userId, period),
  ]);

  const totalSpent = Number(aggregate._sum.amount ?? 0);
  const expenseCount = aggregate._count._all;
  const previousTotal = Number(previous._sum.amount ?? 0);
  const difference = totalSpent - previousTotal;

  const categoryRows = await prisma.category.findMany({
    where: { userId, id: { in: grouped.map((row) => row.categoryId) } },
    select: { id: true, name: true, color: true },
  });
  const categoryById = new Map(categoryRows.map((row) => [row.id, row]));

  const generalBudget = budgets.find((budget) => budget.categoryId === null) ?? null;
  const now = currentPeriod(user.timezone ?? "America/Santiago");
  const isCurrent =
    now.year === period.year && now.month === period.month;
  const elapsedDays =
    isCurrent ?
      Number(todayInTimeZone(user.timezone ?? "America/Santiago").slice(8, 10))
    : daysInMonth(period.year, period.month);

  return {
    generatedAt: new Date().toISOString(),
    period: { ...period, label: monthLabel(period.year, period.month) },
    totalSpent: roundMoney(totalSpent),
    expenseCount,
    averagePerExpense: roundMoney(totalSpent / Math.max(1, expenseCount)),
    dailyAverage: roundMoney(totalSpent / Math.max(1, elapsedDays)),
    previousTotal: roundMoney(previousTotal),
    variationPercentage:
      previousTotal > 0 ? roundOne((difference / previousTotal) * 100) : null,
    budget: generalBudget
      ? {
          amount: generalBudget.amount,
          spent: generalBudget.spent,
          remaining: generalBudget.remaining,
          percentage: generalBudget.percentage,
          status: generalBudget.status,
        }
      : null,
    categories: grouped
      .map((row) => {
        const category = categoryById.get(row.categoryId);
        const categoryTotal = Number(row._sum.amount ?? 0);
        return {
          categoryId: row.categoryId,
          name: category?.name ?? "Sin categoría",
          color: category?.color ?? "#64748B",
          total: roundMoney(categoryTotal),
          percentage: percent(categoryTotal, totalSpent),
        };
      })
      .sort((a, b) => b.total - a.total),
  };
}

export type YearOverview = {
  year: number;
  total: number;
  count: number;
  monthlyAverage: number;
  bestMonth: MonthlyPoint | null;
  worstMonth: MonthlyPoint | null;
  months: MonthlyPoint[];
  byCategory: CategoryBreakdown[];
};

export async function getYearOverview(userId: string, year: number): Promise<YearOverview> {
  const { from } = monthRange(year, 1);
  const { to } = monthRange(year, 12);

  const [aggregate, groupedByDate, groupedByCategory] = await Promise.all([
    prisma.expense.aggregate({
      where: { userId, date: { gte: from, lte: to } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.expense.groupBy({
      by: ["date"],
      where: { userId, date: { gte: from, lte: to } },
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: { date: "asc" },
    }),
    prisma.expense.groupBy({
      by: ["categoryId"],
      where: { userId, date: { gte: from, lte: to } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const totals = new Map<string, { total: number; count: number }>();
  for (const row of groupedByDate) {
    const key = toIsoDate(row.date).slice(0, 7);
    const current = totals.get(key) ?? { total: 0, count: 0 };
    current.total = roundMoney(current.total + Number(row._sum.amount ?? 0));
    current.count += row._count._all;
    totals.set(key, current);
  }

  const months: MonthlyPoint[] = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const key = `${year}-${String(month).padStart(2, "0")}`;
    const value = totals.get(key) ?? { total: 0, count: 0 };
    return {
      year,
      month,
      label: monthShortLabel(year, month),
      total: value.total,
      count: value.count,
    };
  });

  const total = Number(aggregate._sum.amount ?? 0);
  const activeMonths = months.filter((month) => month.count > 0);

  const categoryRows = await prisma.category.findMany({
    where: { userId, id: { in: groupedByCategory.map((row) => row.categoryId) } },
    select: { id: true, name: true, color: true, icon: true },
  });
  const categoryById = new Map(categoryRows.map((row) => [row.id, row]));

  return {
    year,
    total: roundMoney(total),
    count: aggregate._count._all,
    monthlyAverage: roundMoney(
      total / Math.max(1, activeMonths.length || (year < new Date().getFullYear() ? 12 : new Date().getMonth() + 1)),
    ),
    bestMonth:
      activeMonths.length > 0 ?
        activeMonths.reduce((best, month) => (month.total < best.total ? month : best))
      : null,
    worstMonth:
      activeMonths.length > 0 ?
        activeMonths.reduce((worst, month) => (month.total > worst.total ? month : worst))
      : null,
    months,
    byCategory: groupedByCategory
      .map((row) => {
        const category = categoryById.get(row.categoryId);
        const categoryTotal = Number(row._sum.amount ?? 0);
        return {
          categoryId: row.categoryId,
          name: category?.name ?? "Sin categoría",
          color: category?.color ?? "#64748B",
          icon: category?.icon ?? "circle",
          total: roundMoney(categoryTotal),
          count: row._count._all,
          percentage: percent(categoryTotal, total),
        };
      })
      .sort((a, b) => b.total - a.total),
  };
}

export type SimulatorCategory = {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  base: number;
  adjustmentPercent: number;
  projected: number;
};

export type SimulatorResult = {
  start: Period;
  label: string;
  months: number;
  basis: SimulatorInput["basis"];
  baseMonthly: number;
  extraMonthly: number;
  totalBase: number;
  totalProjected: number;
  difference: number;
  differencePercentage: number;
  monthly: {
    year: number;
    month: number;
    label: string;
    base: number;
    projected: number;
  }[];
  byCategory: SimulatorCategory[];
};

async function categoryBase(
  userId: string,
  period: Period,
  basis: SimulatorInput["basis"],
): Promise<Map<string, number>> {
  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true },
  });

  const base = new Map(categories.map((category) => [category.id, 0]));

  if (basis === "selected_month") {
    const { from, to } = monthRange(period.year, period.month);
    const grouped = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: { userId, date: { gte: from, lte: to } },
      _sum: { amount: true },
    });
    for (const row of grouped) {
      base.set(row.categoryId, Number(row._sum.amount ?? 0));
    }
    return base;
  }

  const previous = lastNMonths(addMonths(period, -1), 3);
  const from = monthRange(previous[0].year, previous[0].month).from;
  const to = monthRange(previous[previous.length - 1].year, previous[previous.length - 1].month).to;

  const grouped = await prisma.expense.groupBy({
    by: ["categoryId"],
    where: { userId, date: { gte: from, lte: to } },
    _sum: { amount: true },
  });

  for (const row of grouped) {
    base.set(row.categoryId, roundMoney(Number(row._sum.amount ?? 0) / 3));
  }

  const hasHistory = Array.from(base.values()).some((value) => value > 0);
  if (!hasHistory) {
    return categoryBase(userId, period, "selected_month");
  }

  return base;
}

/**
 * Proyección determinista: toma una base mensual por categoría, aplica ajustes
 * porcentuales y repite el escenario durante el horizonte pedido.
 */
export async function simulate(
  userId: string,
  user: { timezone?: string | null },
  input: SimulatorInput,
): Promise<SimulatorResult> {
  const start = resolvePeriod(user, input);

  const [base, categories] = await Promise.all([
    categoryBase(userId, start, input.basis),
    prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true, color: true, icon: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const adjustmentById = new Map(
    input.adjustments.map((adjustment) => [adjustment.categoryId, adjustment.percent]),
  );

  const byCategory: SimulatorCategory[] = categories.map((category) => {
    const categoryBaseAmount = base.get(category.id) ?? 0;
    const adjustmentPercent = adjustmentById.get(category.id) ?? 0;
    return {
      categoryId: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      base: roundMoney(categoryBaseAmount),
      adjustmentPercent,
      projected: roundMoney(categoryBaseAmount * (1 + adjustmentPercent / 100)),
    };
  });

  const baseMonthly = roundMoney(
    byCategory.reduce((sum, category) => sum + category.base, 0),
  );
  const projectedMonthly = roundMoney(
    byCategory.reduce((sum, category) => sum + category.projected, 0) + input.extraMonthly,
  );

  const monthly = Array.from({ length: input.months }, (_, index) => {
    const period = addMonths(start, index);
    return {
      ...period,
      label: monthLabel(period.year, period.month),
      base: baseMonthly,
      projected: projectedMonthly,
    };
  });

  const totalBase = roundMoney(baseMonthly * input.months);
  const totalProjected = roundMoney(projectedMonthly * input.months);
  const difference = roundMoney(totalProjected - totalBase);

  return {
    start,
    label:
      input.months === 1 ?
        monthLabel(start.year, start.month)
      : `${monthLabel(start.year, start.month)} — ${monthLabel(monthly[monthly.length - 1].year, monthly[monthly.length - 1].month)}`,
    months: input.months,
    basis: input.basis,
    baseMonthly,
    extraMonthly: roundMoney(input.extraMonthly),
    totalBase,
    totalProjected,
    difference,
    differencePercentage: totalBase > 0 ? roundOne((difference / totalBase) * 100) : 0,
    monthly,
    byCategory,
  };
}

/** Texto breve para estados vacíos y avisos de presupuesto. */
export function budgetNotice(budget: BudgetSummary): string {
  if (budget.status === "exceeded") {
    return `Usaste ${formatPercent(budget.percentage, 1)} del presupuesto.`;
  }
  if (budget.status === "warning") {
    return `Ya usaste ${formatPercent(budget.percentage, 1)} del presupuesto.`;
  }
  return `Queda ${formatPercent(100 - budget.percentage, 1)} del presupuesto.`;
}
