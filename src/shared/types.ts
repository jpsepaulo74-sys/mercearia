import z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  purchase_price: z.number().min(0, "Preço de compra deve ser positivo"),
  sale_price: z.number().min(0, "Preço de venda deve ser positivo"),
  stock_quantity: z.number().int().min(0, "Quantidade deve ser positiva"),
  min_stock_alert: z.number().int().min(1, "Alerta mínimo deve ser pelo menos 1"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const SaleSchema = z.object({
  id: z.number().optional(),
  product_id: z.number(),
  product_name: z.string(),
  quantity_sold: z.number().int().min(1, "Quantidade deve ser pelo menos 1"),
  unit_purchase_price: z.number(),
  unit_sale_price: z.number(),
  total_amount: z.number(),
  profit: z.number(),
  sale_date: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const CreateSaleSchema = z.object({
  product_id: z.number(),
  quantity_sold: z.number().int().min(1, "Quantidade deve ser pelo menos 1"),
});

export type Product = z.infer<typeof ProductSchema>;
export type Sale = z.infer<typeof SaleSchema>;
export type CreateSale = z.infer<typeof CreateSaleSchema>;

export interface DashboardStats {
  total_products: number;
  low_stock_count: number;
  daily_sales: number;
  daily_profit: number;
  weekly_sales: number;
  weekly_profit: number;
  monthly_sales: number;
  monthly_profit: number;
}
