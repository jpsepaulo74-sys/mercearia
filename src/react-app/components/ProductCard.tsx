import { AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Product } from "@/shared/types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const isLowStock = product.stock_quantity <= product.min_stock_alert;
  const profit = product.sale_price - product.purchase_price;
  const profitPercent = product.purchase_price > 0 ? (profit / product.purchase_price) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {product.category}
          </p>
        </div>
        {isLowStock && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-1 rounded-full ml-2">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Stock:</span>
          <span className={`font-medium ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {product.stock_quantity} unidades
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Compra:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {product.purchase_price.toFixed(2)} MT
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Venda:</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {product.sale_price.toFixed(2)} MT
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Lucro:</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {profit.toFixed(2)} MT ({profitPercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center space-x-1"
        >
          <Edit className="w-4 h-4" />
          <span>Editar</span>
        </button>
        <button
          onClick={() => product.id && onDelete(product.id)}
          className="flex-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
