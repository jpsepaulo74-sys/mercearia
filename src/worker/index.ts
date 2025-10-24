import { Hono } from "hono";
import { cors } from "hono/cors";
import { ProductSchema, CreateSaleSchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Products endpoints
app.get("/api/products", async (c) => {
  const db = c.env.DB;
  const products = await db.prepare("SELECT * FROM products WHERE deleted_at IS NULL ORDER BY name").all();
  return c.json(products.results);
});

app.post("/api/products", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const product = ProductSchema.parse(body);
  
  const result = await db.prepare(`
    INSERT INTO products (name, category, purchase_price, sale_price, stock_quantity, min_stock_alert)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    product.name,
    product.category,
    product.purchase_price,
    product.sale_price,
    product.stock_quantity,
    product.min_stock_alert
  ).run();
  
  return c.json({ id: result.meta.last_row_id });
});

app.put("/api/products/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const body = await c.req.json();
  const product = ProductSchema.parse(body);
  
  await db.prepare(`
    UPDATE products 
    SET name = ?, category = ?, purchase_price = ?, sale_price = ?, 
        stock_quantity = ?, min_stock_alert = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    product.name,
    product.category,
    product.purchase_price,
    product.sale_price,
    product.stock_quantity,
    product.min_stock_alert,
    id
  ).run();
  
  return c.json({ success: true });
});

app.delete("/api/products/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  await db.prepare("UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Sales endpoints
app.get("/api/sales", async (c) => {
  const db = c.env.DB;
  const sales = await db.prepare(`
    SELECT * FROM sales 
    WHERE deleted_at IS NULL
    ORDER BY sale_date DESC 
    LIMIT 100
  `).all();
  return c.json(sales.results);
});

app.post("/api/sales", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const saleData = CreateSaleSchema.parse(body);
  
  // Get product info
  const product = await db.prepare("SELECT * FROM products WHERE id = ? AND deleted_at IS NULL")
    .bind(saleData.product_id).first() as any;
    
  if (!product) {
    return c.json({ error: "Produto não encontrado" }, 404);
  }
  
  if (Number(product.stock_quantity) < saleData.quantity_sold) {
    return c.json({ error: "Stock insuficiente" }, 400);
  }
  
  const total_amount = Number(product.sale_price) * saleData.quantity_sold;
  const profit = (Number(product.sale_price) - Number(product.purchase_price)) * saleData.quantity_sold;
  
  // Create sale record
  await db.prepare(`
    INSERT INTO sales (product_id, product_name, quantity_sold, unit_purchase_price, 
                      unit_sale_price, total_amount, profit)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    saleData.product_id,
    product.name,
    saleData.quantity_sold,
    product.purchase_price,
    product.sale_price,
    total_amount,
    profit
  ).run();
  
  // Update product stock
  await db.prepare(`
    UPDATE products 
    SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(saleData.quantity_sold, saleData.product_id).run();
  
  return c.json({ success: true, total_amount, profit });
});

app.delete("/api/sales/clear-history", async (c) => {
  const db = c.env.DB;
  await db.prepare("UPDATE sales SET deleted_at = CURRENT_TIMESTAMP WHERE deleted_at IS NULL").run();
  return c.json({ success: true });
});

// Dashboard stats
app.get("/api/dashboard/stats", async (c) => {
  const db = c.env.DB;
  
  const totalProducts = await db.prepare("SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL").first() as any;
  const lowStockCount = await db.prepare(`
    SELECT COUNT(*) as count FROM products 
    WHERE stock_quantity <= min_stock_alert AND deleted_at IS NULL
  `).first() as any;
  
  const dailySales = await db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) as total, COALESCE(SUM(profit), 0) as profit
    FROM sales 
    WHERE DATE(sale_date) = DATE('now') AND deleted_at IS NULL
  `).first() as any;
  
  const weeklySales = await db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) as total, COALESCE(SUM(profit), 0) as profit
    FROM sales 
    WHERE sale_date >= DATE('now', '-7 days') AND deleted_at IS NULL
  `).first() as any;
  
  const monthlySales = await db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) as total, COALESCE(SUM(profit), 0) as profit
    FROM sales 
    WHERE sale_date >= DATE('now', '-30 days') AND deleted_at IS NULL
  `).first() as any;
  
  return c.json({
    total_products: totalProducts?.count || 0,
    low_stock_count: lowStockCount?.count || 0,
    daily_sales: dailySales?.total || 0,
    daily_profit: dailySales?.profit || 0,
    weekly_sales: weeklySales?.total || 0,
    weekly_profit: weeklySales?.profit || 0,
    monthly_sales: monthlySales?.total || 0,
    monthly_profit: monthlySales?.profit || 0,
  });
});

// Trash endpoints
app.get("/api/trash/products", async (c) => {
  const db = c.env.DB;
  const products = await db.prepare(`
    SELECT * FROM products 
    WHERE deleted_at IS NOT NULL 
    ORDER BY deleted_at DESC
  `).all();
  return c.json(products.results);
});

app.get("/api/trash/sales", async (c) => {
  const db = c.env.DB;
  const sales = await db.prepare(`
    SELECT * FROM sales 
    WHERE deleted_at IS NOT NULL 
    ORDER BY deleted_at DESC
  `).all();
  return c.json(sales.results);
});

app.post("/api/trash/products/:id/restore", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  await db.prepare("UPDATE products SET deleted_at = NULL WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

app.post("/api/trash/sales/:id/restore", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  await db.prepare("UPDATE sales SET deleted_at = NULL WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

app.delete("/api/trash/products/:id/permanent", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  await db.prepare("DELETE FROM products WHERE id = ? AND deleted_at IS NOT NULL").bind(id).run();
  return c.json({ success: true });
});

app.delete("/api/trash/sales/:id/permanent", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  await db.prepare("DELETE FROM sales WHERE id = ? AND deleted_at IS NOT NULL").bind(id).run();
  return c.json({ success: true });
});

export default app;
