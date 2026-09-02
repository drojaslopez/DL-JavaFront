import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DashboardResponse, ProjectionResponse } from '../types';
import reportService from '../services/reportService';

const COLORS = ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const DashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [projection, setProjection] = useState<ProjectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashData, projData] = await Promise.all([
        reportService.getDashboard(month, year),
        reportService.getProjection(6),
      ]);
      setDashboard(dashData);
      setProjection(projData);
    } catch (err) {
      setError('Error al cargar reportes. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const byExpenseType = dashboard?.byExpenseType || { FIXED: 0, VARIABLE: 0 };
  const byScope = dashboard?.byScope || { HOME: 0, OUTING: 0, PERSONAL: 0 };

  const expenseTypeData = dashboard ? [
    { name: 'Fijos', value: byExpenseType.FIXED || 0 },
    { name: 'Variables', value: byExpenseType.VARIABLE || 0 },
  ] : [];

  const scopeData = dashboard ? [
    { name: 'Hogar', value: byScope.HOME || 0 },
    { name: 'Salida', value: byScope.OUTING || 0 },
    { name: 'Personal', value: byScope.PERSONAL || 0 },
  ] : [];

  const categoryData = dashboard && dashboard.byCategory ? dashboard.byCategory.map((c) => ({
    name: c.category,
    value: c.total,
  })) : [];

  const projectionData = projection ? projection.projections.map((p) => ({
    period: p.period,
    monto: p.committedTotal,
  })) : [];

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-slate-400 text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard y Reportes</h2>
          <p className="text-sm text-slate-400 mt-1">Métricas financieras del hogar</p>
        </div>
        <div className="flex gap-3">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(2026, i).toLocaleString('es', { month: 'long' })}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500">
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}

      {dashboard && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400">Total del Mes</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">${dashboard.monthTotal.toLocaleString()}</h3>
              <p className="text-xs text-slate-500 mt-1">{dashboard.period}</p>
            </div>
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400">Gastos Fijos</p>
              <h3 className="text-3xl font-extrabold text-cyan-400 mt-2">${(byExpenseType.FIXED || 0).toLocaleString()}</h3>
              <p className="text-xs text-slate-500 mt-1">{dashboard.monthTotal > 0 ? ((byExpenseType.FIXED / dashboard.monthTotal) * 100).toFixed(1) : 0}% del total</p>
            </div>
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400">Gastos Variables</p>
              <h3 className="text-3xl font-extrabold text-pink-400 mt-2">${(byExpenseType.VARIABLE || 0).toLocaleString()}</h3>
              <p className="text-xs text-slate-500 mt-1">{dashboard.monthTotal > 0 ? ((byExpenseType.VARIABLE / dashboard.monthTotal) * 100).toFixed(1) : 0}% del total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h4 className="text-lg font-bold text-slate-200 mb-4">Por Tipo de Gasto</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expenseTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {expenseTypeData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h4 className="text-lg font-bold text-slate-200 mb-4">Por Alcance</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={scopeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {scopeData.map((_, index) => (
                      <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {categoryData.length > 0 && (
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h4 className="text-lg font-bold text-slate-200 mb-4">Por Categoría</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {projectionData.length > 0 && (
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <h4 className="text-lg font-bold text-slate-200 mb-4">Proyección de Compromisos Futuros</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectionData}>
              <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="monto" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
