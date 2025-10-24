
-- Remove indexes
DROP INDEX idx_sales_deleted_at;
DROP INDEX idx_products_deleted_at;

-- Remove deleted_at columns
ALTER TABLE sales DROP COLUMN deleted_at;
ALTER TABLE products DROP COLUMN deleted_at;
