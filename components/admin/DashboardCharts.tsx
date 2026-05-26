'use client'

import { useDashboardTheme } from './DashboardThemeProvider'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

type Props = {
  leadsByDay:  { date: string; count: number }[]
  leadsByDest: { name: string; count: number }[]
  leadsBySrc:  { name: string; value: number }[]
  funnel:      { new: number; contacted: number; converted: number; lost: number }
}

const PIE_COLORS = ['#00A7D8', '#FFC247', '#2E8B57', '#FF7A59', '#7C3AED']

const SOURCE_PT: Record<string, string> = {
  contact_form: 'Formulário', destination_page: 'Destino',
  blog: 'Blog', capture_page: 'Captura', Direto: 'Direto',
}

export default function DashboardCharts({ leadsByDay, leadsByDest, leadsBySrc, funnel }: Props) {
  const { accentColor, mode } = useDashboardTheme()
  const grid   = mode === 'dark' ? '#2A3A4E' : '#F3F4F6'
  const axis   = mode === 'dark' ? '#475569' : '#9CA3AF'
  const tip    = mode === 'dark' ? '#1A2535' : '#FFFFFF'
  const tipBdr = mode === 'dark' ? '#2A3A4E' : '#E5E7EB'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Leads por dia */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--dash-text)' }}>
          Leads — últimos 30 dias
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={leadsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: axis }} tickLine={false} axisLine={false}
              interval={4} />
            <YAxis tick={{ fontSize: 10, fill: axis }} tickLine={false} axisLine={false} width={24} />
            <Tooltip
              contentStyle={{ background: tip, border: `1px solid ${tipBdr}`, borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: 'var(--dash-text)' }}
            />
            <Line type="monotone" dataKey="count" stroke={accentColor} strokeWidth={2.5}
              dot={false} activeDot={{ r: 5, fill: accentColor }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leads por destino */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--dash-text)' }}>
          Interesse por destino
        </h3>
        {leadsByDest.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-sm" style={{ color: 'var(--dash-text-soft)' }}>
            Nenhum dado ainda
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={leadsByDest} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: axis }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: axis }} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: tip, border: `1px solid ${tipBdr}`, borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="count" fill={accentColor} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Origem dos leads */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--dash-text)' }}>
          Origem dos leads
        </h3>
        {leadsBySrc.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-sm" style={{ color: 'var(--dash-text-soft)' }}>
            Nenhum dado ainda
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={leadsBySrc} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                  dataKey="value" paddingAngle={3}>
                  {leadsBySrc.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: tip, border: `1px solid ${tipBdr}`, borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {leadsBySrc.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span style={{ color: 'var(--dash-text-soft)' }}>
                    {SOURCE_PT[item.name] || item.name}
                  </span>
                  <span className="ml-auto font-bold" style={{ color: 'var(--dash-text)' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Funil visual */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--dash-text)' }}>
          Funil de conversão
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Novos leads',   count: funnel.new,       color: '#FFC247', pct: 100 },
            { label: 'Contactados',   count: funnel.contacted, color: '#00A7D8', pct: funnel.new ? Math.round((funnel.contacted / funnel.new) * 100) : 0 },
            { label: 'Convertidos',   count: funnel.converted, color: '#2E8B57', pct: funnel.new ? Math.round((funnel.converted / funnel.new) * 100) : 0 },
            { label: 'Perdidos',      count: funnel.lost,      color: '#FF7A59', pct: funnel.new ? Math.round((funnel.lost / funnel.new) * 100) : 0 },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--dash-text-soft)' }}>{s.label}</span>
                <span className="font-bold" style={{ color: s.color }}>{s.count} · {s.pct}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--dash-bg)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
