import { App } from '@/app';
import { ValidateEnv } from '@/config/validateEnv';

ValidateEnv();

const app = new App();

app.listen();

/** TASK REQUIREMENTS
 *
 * Use CQRS pattern
 *
 * Price validation:
 *          - Ensure that the price of a product is always positive
 *
 * Validate inputs for all endpoints
 *
 * Proper error handling with codes and messages
 *          - server,
 *          - not found,
 *          - validation
 *
 * Ensure the project is well-structured and follows best practices for Node.js development
 *
 * ENDPOINTS:
 *
 * GET  /products
 *          - get list of products
 * POST /products
 *          - create new product
 *              - name varchar max 50;
 *              - description varchar max 50; as per instruction, short but whatever
 *              - price int
 *              - stock int positive
 *              - all required
 * POST /products/:id/restock
 *          - increase the stock level of a product
 *              - amount int positive
 * POST /products/:id/sell
 *          - decrease the stock level of a product
 *              - amount int negative
 *              - ensure porduct can't go below zero
 * POST /orders
 *          - create new order
 *              - customerId
 *              - products
 *                  - [productId, amount]
 *          - ensure order can't be created when stock is insufficient
 *
 */
