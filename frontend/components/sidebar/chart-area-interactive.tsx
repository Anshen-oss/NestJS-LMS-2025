"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ReferenceLine,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

const chartConfig = {
  enrollments: {
    label: "Inscriptions",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const LOCALE = "fr-FR";
const TZ = "Europe/Paris";
const dfDayMonth = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
  timeZone: TZ,
});
const dfRangeMonth = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
  timeZone: TZ,
});

// --- utils dates ---
function toISODate(d: Date) {
  // force en UTC pour éviter le décalage TZ dans le split("T")
  const d2 = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return d2.toISOString().slice(0, 10); // YYYY-MM-DD
}
function addDays(d: Date, delta: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + delta);
  return c;
}
function maxDateOf(data: { date: string }[]) {
  return data.reduce((max, cur) => {
    const d = new Date(cur.date);
    return d > max ? d : max;
  }, new Date(data[0].date));
}

// --- calculs numériques ---
function sumEnrollments(data: { enrollments: number }[]) {
  return data.reduce(
    (acc, d) => acc + (Number.isFinite(d.enrollments) ? d.enrollments : 0),
    0
  );
}

/**
 * Normalise sur N jours glissants:
 * - fin = date max trouvée dans `raw`
 * - début = fin - (N-1)
 * - pour chaque date de l'intervalle: valeur existante ou 0
 */
function normalizeLastNDays(
  raw: { date: string; enrollments: number }[],
  days: number
) {
  const end = maxDateOf(raw);
  const start = addDays(end, -(days - 1));

  // indexation par date ISO
  const byDate = new Map<string, number>();
  for (const r of raw) {
    const iso = toISODate(new Date(r.date));
    const v = Number.isFinite(r.enrollments) ? r.enrollments : 0;
    byDate.set(iso, (byDate.get(iso) ?? 0) + v);
  }

  // fabrique la série complète
  const out: { date: string; enrollments: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    const iso = toISODate(d);
    out.push({ date: iso, enrollments: byDate.get(iso) ?? 0 });
  }
  return out;
}

interface ChartAreaInteractiveProps {
  data: { date: string; enrollments: number }[];
  days?: number; // défaut 30
}

export function ChartAreaInteractive({
  data,
  days = 30,
}: ChartAreaInteractiveProps) {
  // 30 jours glissants basés sur la dernière date disponible
  const normalized = React.useMemo(
    () => normalizeLastNDays(data, days),
    [data, days]
  );

  // totaux/métriques basés sur la série normalisée de N jours
  const totalEnrollmentsNumber = React.useMemo(
    () => sumEnrollments(normalized),
    [normalized]
  );
  const first = new Date(normalized[0].date);
  const last = new Date(normalized[normalized.length - 1].date);
  const rangeLabel = `${dfRangeMonth.format(first)} – ${dfRangeMonth.format(last)}`;
  const avg = totalEnrollmentsNumber / normalized.length;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Inscriptions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {`Inscriptions sur la période (${rangeLabel}) : `}
            <strong>{totalEnrollmentsNumber}</strong>
          </span>
          <span className="@[540px]/card:hidden">
            {`${normalized.length} j : `}
            <strong>{totalEnrollmentsNumber}</strong>
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent
        className="px-2 pt-4 sm:px-6 sm:pt-6"
        style={{ ["--bar-size" as never]: "10" }}
      >
        <div className="@[640px]/card:[--bar-size:14] @[920px]/card:[--bar-size:18]">
          <ChartContainer
            className="aspect-auto h-[250px] w-full"
            config={chartConfig}
            aria-label={`Histogramme des inscriptions du ${dfRangeMonth.format(
              first
            )} au ${dfRangeMonth.format(last)} (total ${totalEnrollmentsNumber})`}
            role="img"
          >
            <BarChart
              data={normalized}
              margin={{ left: 12, right: 12 }}
              barSize={
                Number(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    "--bar-size"
                  )
                ) || undefined
              }
            >
              <CartesianGrid vertical={false} />
              <YAxis tickLine={false} axisLine={false} width={30} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tickFormatter={(value: string) =>
                  dfDayMonth.format(new Date(value))
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[180px]"
                    labelFormatter={(value: string) =>
                      dfDayMonth.format(new Date(value))
                    }
                    formatter={(val, name) =>
                      name === "enrollments"
                        ? [String(val), "Inscriptions"]
                        : [String(val), name as string]
                    }
                  />
                }
              />
              <ReferenceLine
                y={avg}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
              <Bar
                dataKey="enrollments"
                fill="var(--color-enrollments)"
                barSize={undefined}
                className="@[640px]/card:bar-[14] @[920px]/card:bar-[18]"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
