import { useState } from "react";
import { X } from "lucide-react";
import { Product } from "@/shared/types";

interface SaleFormProps {
  products: Product[];
  onSubmit: (productId: number, quantity: number) => void;
  onClose: () => void;
}

export default function SaleForm({ products, onSubmit, onClose }: SaleFormProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const totalAmount = selectedProduct ? selectedProduct.sale_price * quantity : 0;
  const profit = selectedProduct ? (selectedProduct.sale_price - selectedProduct.purchase_price) * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId && quantity > 0) {
      onSubmit(selectedProductId, quantity);
    }
  };

  const availableProducts = products.filter(p => p.stock_quantity > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nova Venda
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {availableProducts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum produto disponível em stock.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Produto
              </label>
              <select
                required
                value={selectedProductId || ""}
                onChange={(e) => setSelectedProductId(parseInt(e.target.value) || null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecionar produto</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.sale_price.toFixed(2)} MT (Stock: {product.stock_quantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                required
                min="1"
                max={selectedProduct?.stock_quantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1"
              />
              {selectedProduct && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Disponível: {selectedProduct.stock_quantity} unidades
                </p>
              )}
            </div>

            {selectedProduct && quantity > 0 && (
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Preço unitário:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedProduct.sale_price.toFixed(2)} MT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {totalAmount.toFixed(2)} MT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Lucro:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {profit.toFixed(2)} MT
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!selectedProductId || quantity <= 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Registar Venda
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
