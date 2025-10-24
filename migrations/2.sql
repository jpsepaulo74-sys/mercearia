
-- Add deleted_at column to products table for soft delete
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP NULL;

-- Add deleted_at column to sales table for soft delete  
ALTER TABLE sales ADD COLUMN deleted_at TIMESTAMP NULL;

-- Create indexes for better performance on deleted items queries
CREATE INDEX idx_products_deleted_at ON products(deleted_at);
CREATE INDEX idx_sales_deleted_at ON sales(deleted_at);
