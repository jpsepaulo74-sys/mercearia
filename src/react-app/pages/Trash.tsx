import { useState, useEffect } from "react";
import { Package, TrendingUp, RotateCcw, Trash2, AlertCircle } from "lucide-react";

interface DeletedProduct {
  id: number;
  name: string;
  category: string;
  purchase_price: number;
  sale_price: number;
  stock_quantity: number;
  deleted_at: string;
}

interface DeletedSale {
  id: number;
  product_name: string;
  quantity_sold: number;
  total_amount: number;
  profit: number;
  sale_date: string;
  deleted_at: string;
}

export default function TrashPage() {
  const [deletedProducts, setDeletedProducts] = useState<DeletedProduct[]>([]);
  const [deletedSales, setDeletedSales] = useState<DeletedSale[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "sales">("products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  const fetchDeletedItems = async () => {
    try {
      setLoading(true);
      const [productsRes, salesRes] = await Promise.all([
        fetch("/api/trash/products"),
        fetch("/api/trash/sales"),
      ]);
      
      const products = await productsRes.json();
      const sales = await salesRes.json();
      
      setDeletedProducts(products);
      setDeletedSales(sales);
    } catch (error) {
      console.error("Erro ao carregar itens eliminados:", error);
    } finally {
      setLoading(false);
    }
  };

  const restoreProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/trash/products/${id}/restore`, {
        method: "POST",
      });
      
      if (response.ok) {
        setDeletedProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Erro ao restaurar produto:", error);
    }
  };

  const restoreSale = async (id: number) => {
    try {
      const response = await fetch(`/api/trash/sales/${id}/restore`, {
        method: "POST",
      });
      
      if (response.ok) {
        setDeletedSales(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Erro ao restaurar venda:", error);
    }
  };

  const permanentlyDeleteProduct = async (id: number) => {
    if (!confirm("Tem certeza que deseja eliminar permanentemente este produto? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/trash/products/${id}/permanent`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setDeletedProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Erro ao eliminar produto permanentemente:", error);
    }
  };

  const permanentlyDeleteSale = async (id: number) => {
    if (!confirm("Tem certeza que deseja eliminar permanentemente esta venda? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/trash/sales/${id}/permanent`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setDeletedSales(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Erro ao eliminar venda permanentemente:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-red-600 p-2 rounded-lg">
          <Trash2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Caixa de Lixo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e restaure itens eliminados
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "products"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produtos ({deletedProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "sales"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Vendas ({deletedSales.length})</span>
          </button>
        </nav>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          {deletedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum produto eliminado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Os produtos eliminados aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {deletedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {product.category}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>Stock: {product.stock_quantity}</span>
                        <span>Preço: {product.sale_price.toFixed(2)} MT</span>
                        <span className="text-red-500">
                          Eliminado: {new Date(product.deleted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => restoreProduct(product.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Restaurar produto"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => permanentlyDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div>
          {deletedSales.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma venda eliminada
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                As vendas eliminadas aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {deletedSales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {sale.product_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <span>Quantidade: {sale.quantity_sold}</span>
                        <span>Total: {sale.total_amount.toFixed(2)} MT</span>
                        <span>Lucro: {sale.profit.toFixed(2)} MT</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>Venda: {new Date(sale.sale_date).toLocaleDateString()}</span>
                        <span className="text-red-500">
                          Eliminada: {new Date(sale.deleted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => restoreSale(sale.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Restaurar venda"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => permanentlyDeleteSale(sale.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Warning */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
              Aviso Importante
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Os itens eliminados permanentemente não podem ser recuperados. Use esta função com cuidado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
