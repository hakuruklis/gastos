import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../lib/format'
import { CATEGORY_COLORS } from '../lib/types'

type Props = {
  total: number
  average: number
  averageLabel: string
  count: number
  byCategory: { name: string; value: number }[]
  trend: { label: string; value: number }[]
}

export function Summary({ total, average, averageLabel, count, byCategory, trend }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
        <Stat label="Total" value={formatCurrency(total)} />
        <Stat label={averageLabel} value={formatCurrency(average)} />
        <Stat label="Movimientos" value={String(count)} />
      </div>

      <Card title="Por categoría" className="lg:col-span-1">
        {byCategory.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                {byCategory.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#a3a3a3'} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title="Evolución" className="lg:col-span-2">
        {trend.every((point) => point.value === 0) ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={56} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: '#f5f5f5' }} />
              <Bar dataKey="value" fill="#171717" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function Card({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-4 ${className ?? ''}`}>
      <p className="mb-2 text-xs font-medium text-neutral-500">{title}</p>
      {children}
    </div>
  )
}

function Empty() {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-neutral-400">
      Sin datos
    </div>
  )
}
