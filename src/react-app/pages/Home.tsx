import { useState, useEffect } from "react";
import { Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { DashboardStats } from "@/shared/types";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    low_stock_count: 0,
    daily_sales: 0,
    daily_profit: 0,
    weekly_sales: 0,
    weekly_profit: 0,
    monthly_sales: 0,
    monthly_profit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo ao Gestor de Mercearia
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumo das suas actividades comerciais
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_products}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stock Baixo</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.low_stock_count}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vendas Hoje</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.daily_sales.toFixed(2)} MT
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lucro Hoje</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.daily_profit.toFixed(2)} MT
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Period Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório Diário
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vendas:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.daily_sales.toFixed(2)} MT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lucro:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {stats.daily_profit.toFixed(2)} MT
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório Semanal
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vendas:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.weekly_sales.toFixed(2)} MT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lucro:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {stats.weekly_profit.toFixed(2)} MT
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório Mensal
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vendas:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.monthly_sales.toFixed(2)} MT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lucro:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {stats.monthly_profit.toFixed(2)} MT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-2">Acções Rápidas</h3>
        <p className="text-green-100 mb-4">
          Gerir a sua mercearia de forma eficiente
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/products"
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Gerir Produtos
          </a>
          <a
            href="/sales"
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Registar Venda
          </a>
        </div>
      </div>
    </div>
  );
}
