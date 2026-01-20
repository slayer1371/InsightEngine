export const DATABASE_SCHEMA = `
You have access to a PostgreSQL database with the following tables.
IMPORTANT: Table names are case-sensitive and must be wrapped in double quotes (e.g., "Order", "Product").

1. "User" table:
   - id (text, primary key, cuid)
   - name (text, nullable)
   - email (text, unique, nullable)
   - emailVerified (timestamp, nullable)
   - image (text, nullable)
   - password (text, nullable)

2. "Product" table:
   - id (text, primary key, cuid)
   - name (text, unique) - the product name
   - category (text) - product category
   - price (decimal) - unit price
   - createdAt (timestamp, defaults to now)
   - userId (text, foreign key -> User.id)

3. "Order" table:
   - id (text, primary key, cuid)
   - status (text) - e.g., 'completed', 'pending', 'cancelled'
   - totalAmount (decimal) - total order value
   - createdAt (timestamp, defaults to now) - when the order was placed
   - userId (text, foreign key -> User.id)

4. "OrderItem" table (junction table linking Orders to Products):
   - id (text, primary key, cuid)
   - quantity (integer) - number of units ordered
   - orderId (text, foreign key -> Order.id)
   - productId (text, foreign key -> Product.id)

KEY RELATIONSHIPS:
- Each Order belongs to one User (Order.userId -> User.id)
- Each Product belongs to one User (Product.userId -> User.id)
- Each Order has many OrderItems (Order.id -> OrderItem.orderId)
- Each OrderItem references one Product (OrderItem.productId -> Product.id)

COMMON QUERY PATTERNS:
- To get revenue: SUM("totalAmount") from "Order"
- To get top products: JOIN "OrderItem" with "Product", GROUP BY product, SUM quantities or amounts
- To filter by date: Use "createdAt" column with date comparisons
- To filter by user: Always include WHERE "userId" = $1 for multi-tenant queries

IMPORTANT NOTES:
- Always use double quotes around table and column names
- Decimal values are stored as numeric type
- Dates are stored as timestamp with time zone
`
