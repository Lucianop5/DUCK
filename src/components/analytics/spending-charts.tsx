"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCLP } from "@/lib/date";

export function SpendingChart({ data, label }: { data: { label: string; total: number }[]; label: string }) {
  return <div role="img" aria-label={label} className="h-64 min-w-0">
    <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 5 }}>
      <CartesianGrid vertical={false} stroke="#c9c3b5" strokeDasharray="2 4" />
      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#171614" }} tickLine={false} axisLine={false} minTickGap={25} />
      <YAxis width={65} tick={{ fontSize: 10, fill: "#171614" }} tickFormatter={(value: number) => formatCLP(value)} tickLine={false} axisLine={false} />
      <Tooltip formatter={(value) => [formatCLP(Number(value)), "Gastado"]} contentStyle={{ background: "#f3efe4", border: "1px solid #171614", color: "#171614" }} />
      <Bar dataKey="total" fill="#b63424" maxBarSize={40} isAnimationActive={false} />
    </BarChart></ResponsiveContainer>
  </div>;
}
