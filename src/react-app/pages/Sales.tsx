import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Product, Sale } from "@/shared/types";
import SaleForm from "@/react-app/components/SaleForm";

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    Promise.all([fetchSales(), fetchProducts()]).finally(() => setLoading(false));
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales");
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const handleCreateSale = async (productId: number, quantity: number) => {
    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity_sold: quantity }),
      });
      
      if (response.ok) {
        await Promise.all([fetchSales(), fetchProducts()]);
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao registar venda");
      }
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      alert("Erro ao registar venda");
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Tem a certeza que deseja eliminar todo o histórico de vendas?")) return;
    
    try {
      const response = await fetch("/api/sales/clear-history", {
        method: "DELETE",
      });
      
      if (response.ok) {
        await fetchSales();
        alert("Histórico de vendas eliminado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      alert("Erro ao limpar histórico");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestão de Vendas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {sales.length} vendas registadas
          </p>
        </div>
        <div className="flex space-x-3">
          {sales.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Limpar Histórico</span>
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Venda</span>
          </button>
        </div>
      </div>

      {/* Sales List */}
      {sales.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma venda registada
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Comece registando a sua primeira venda
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Preço Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lucro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {sale.product_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {sale.quantity_sold}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {sale.unit_sale_price.toFixed(2)} MT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {sale.total_amount.toFixed(2)} MT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {sale.profit.toFixed(2)} MT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(sale.sale_date || sale.created_at || "")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <SaleForm
          products={products}
          onSubmit={handleCreateSale}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
