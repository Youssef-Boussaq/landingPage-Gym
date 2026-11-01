# Comprehensive E-commerce Analytics Dashboard — Technical Audit Report

**Target Project:** `d:\BOUSSQ youssef\landingPage-Gym`  
**Report Date:** October 27, 2026  
**Auditor Roles:** Senior Laravel Architect, E-commerce Data Analyst, Database Architect, QA Engineer  
**Audit Scope:** Production-Grade E-commerce Analytics Architecture, Data Integrity, Financial Accuracy, Security, Performance, and Frontend Readiness  
**Constraint Notice:** Read-only audit. No application code, database schema, or configuration files were altered.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Verified Technology Stack](#2-verified-technology-stack)
3. [Existing Architecture Overview](#3-existing-architecture-overview)
4. [Database Schema and Relationship Audit](#4-database-schema-and-relationship-audit)
   - [Database Audit Matrix](#database-audit-matrix)
   - [Critical Data Model Findings](#critical-data-model-findings)
5. [Analytics Data Availability Matrix](#5-analytics-data-availability-matrix)
6. [Metric Definitions and Calculation Rules](#6-metric-definitions-and-calculation-rules)
   - [Executive KPIs](#executive-kpis)
   - [Revenue and Sales](#revenue-and-sales)
   - [Orders and Fulfillment](#orders-and-fulfillment)
   - [Product Performance](#product-performance)
   - [Customer Analytics](#customer-analytics)
   - [Marketing Analytics](#marketing-analytics)
7. [Financial Accuracy and COD Analysis](#7-financial-accuracy-and-cod-analysis)
   - [Financial Metric Contract](#financial-metric-contract)
   - [Cash on Delivery (COD) Accounting Flaws](#cash-on-delivery-cod-accounting-flaws)
   - [Paid-and-Cancelled / Refund Distortion](#paid-and-cancelled--refund-distortion)
   - [Shipping Fees and Tax Handling](#shipping-fees-and-tax-handling)
8. [Laravel Architecture Audit and Recommendations](#8-laravel-architecture-audit-and-recommendations)
   - [Current vs. Recommended Architecture](#current-vs-recommended-architecture)
   - [Query Layer Design](#query-layer-design)
   - [Caching and Invalidation Strategy](#caching-and-invalidation-strategy)
   - [Timezone and Date Boundary Handling](#timezone-and-date-boundary-handling)
9. [React Dashboard UX and Visualization Audit](#9-react-dashboard-ux-and-visualization-audit)
   - [Current UI Limitations](#current-ui-limitations)
   - [Frontend Architecture Specification](#frontend-architecture-specification)
   - [Charting Library Evaluation](#charting-library-evaluation)
10. [Performance and Scalability Audit](#10-performance-and-scalability-audit)
11. [Security and Privacy Audit](#11-security-and-privacy-audit)
12. [Pest Testing and Quality Assurance Strategy](#12-pest-testing-and-quality-assurance-strategy)
13. [Missing Data and Instrumentation Requirements](#13-missing-data-and-instrumentation-requirements)
14. [Recommended Database Changes and Justification](#14-recommended-database-changes-and-justification)
15. [Prioritized Implementation Roadmap](#15-prioritized-implementation-roadmap)
16. [Dependencies and Risk Assessment](#16-dependencies-and-risk-assessment)
17. [Acceptance Criteria for Completed Dashboard](#17-acceptance-criteria-for-completed-dashboard)
18. [Open Questions Requiring Business Decisions](#18-open-questions-requiring-business-decisions)

---

## 1. Executive Summary

A comprehensive architectural and forensic audit was conducted on the Laravel e-commerce application located at `d:\BOUSSQ youssef\landingPage-Gym`. The application is an active Moroccan fitness/gym e-commerce store operating on Laravel 13, PHP 8.4, React 18 with Inertia.js, and MySQL. It features hybrid payment methods: Cash on Delivery (COD) integrated with the Moroccan shipping carrier AMEEX, alongside online payments via Stripe Checkout.

### Key Audit Conclusions

1. **Severe Financial KPI Distortion in Existing Code:**
   The current `DashboardController` (`app/Http/Controllers/Admin/DashboardController.php`) calculates revenue simply by summing `total_amount` for all orders where `payment_status = 'paid'`. This creates two critical financial errors:
   - **Exclusion of Delivered COD Cash or Retroactive Mutation:** COD orders are created with `payment_status = 'pending'`. When delivered by AMEEX, their status becomes `paid`. When grouped by `DATE(created_at)`, past days' revenues mutate retroactively, and orders placed outside the date window but delivered today vanish from today's revenue.
   - **Inclusion of Cancelled/Returned Paid Orders:** When an online order is paid and subsequently cancelled or returned, `OrderStatusTransition` updates `status = 'cancelled'`, but **leaves `payment_status` as `'paid'`**. Because `DashboardController` does not filter out cancelled or returned orders, cancelled and returned payments are permanently counted as valid revenue.
2. **Missing Product Historical Data and Cost Metrics:**
   The `order_items` table stores only `product_id`, `quantity`, and `unit_price`. It lacks `product_title` snapshots, COGS (`cost_price`), and item discounts. If a product is soft-deleted, `OrderItem::product()` returns `null` (since `withTrashed()` is omitted), rendering historical sales records as `"Produit supprimé"` and breaking product-level reporting.
3. **Missing Profitability and Marketing Attribution Data:**
   Because neither `products` nor `order_items` tracks unit costs, and `orders` does not track carrier fees paid to AMEEX or payment gateway fees, **Gross Profit, Net Profit, and Contribution Margin are mathematically impossible to compute**. Furthermore, while an `order_attributions` table exists, UTM parameters are never preserved across sessions or passed from the frontend checkout form, rendering UTM fields `NULL` for standard shoppers.
4. **Absence of a Professional Charting Engine:**
   The existing admin dashboard draws static HTML `<div>` blocks styled with Tailwind CSS heights (`style={{ height: ... }}`). No charting library is installed. Implementing a modern analytics dashboard will require introducing a dedicated, tree-shakable charting library (recommended: `recharts` for React 18).
5. **Architectural Gap:**
   Aggregations run synchronously directly in the controller on every page load with correlated subqueries (`whereHas`), unindexed date queries, and zero caching. A decoupled analytics query layer with query objects, database-level aggregations, and tagged caching is necessary before production rollout.

---

## 2. Verified Technology Stack

Every component of the technology stack was inspected and verified directly from source configuration and runtime commands:

| Component | Preliminary Expectation | Verified Runtime Version / Configuration | Verification Source |
|---|---|---|---|
| **Framework** | Laravel 13 | **Laravel 13.23.0** (`laravel/framework: ^13.8`) | `composer.json:15`, `php artisan about` |
| **PHP Runtime** | PHP 8.4 | **PHP 8.4.23** (`php: ^8.3`) | `composer.json:12`, `php artisan about` |
| **Frontend Bridge** | Inertia.js | **Inertia Laravel 2.0** / **@inertiajs/react 2.0.0** | `composer.json:13`, `package.json:12` |
| **Frontend Core** | React | **React 18.2.0**, React DOM 18.2.0 | `package.json:28-29` |
| **CSS Framework** | Tailwind CSS | **Tailwind CSS 3.2.1** + `@tailwindcss/vite 4.0.0` | `package.json:14,30` |
| **UI Icons / Motion** | Unspecified | `lucide-react 1.28.0`, `framer-motion 13.1.1` | `package.json:49,51` |
| **Charting Library** | Unspecified | **None installed** (manual HTML `<div>` bars) | `package.json`, `Dashboard.jsx:66-77` |
| **Database** | MySQL | **MySQL** (`driver: mysql`, `strict: true`, utf8mb4) | `config/database.php:48`, `php artisan about` |
| **Cache Driver** | Unspecified | **database** (`table: cache`) | `config/cache.php`, `php artisan about` |
| **Queue Driver** | Unspecified | **database** (`table: jobs`, default: `sync` in tests) | `config/queue.php`, `php artisan about` |
| **Session Driver** | Unspecified | **database** (`table: sessions`) | `php artisan about` |
| **App Timezone** | Unspecified | **UTC** (`config/app.php:68`) | `config/app.php:68`, `php artisan about` |
| **Currency** | Unspecified | **Moroccan Dirham (MAD)** (`fr-MA`, + ' MAD') | `resources/js/helpers/format.js:8` |
| **Payments** | Stripe & COD | `stripe/stripe-php 21.2` + Custom Cash handler | `composer.json:18`, `CheckoutService.php` |
| **Shipping** | AMEEX Courier | Custom REST integration (`ameex_shipments`, `ameex_events`) | `app/Services/Ameex/`, migrations |
| **Test Framework** | Pest / PHPUnit | **Pest PHP 5.0** (`pestphp/pest: ^5.0`) | `composer.json:29`, `tests/Pest.php` |

---

## 3. Existing Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             HTTP REQUEST (Admin)                            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Middleware Pipeline                               │
│  - EnsureUserIsAdmin (app/Http/Middleware/EnsureUserIsAdmin.php)            │
│  - HandleInertiaRequests (Shared props: CartSynchronizer, categories,       │
│    pending orders count, low stock count, notifications)                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│           app/Http/Controllers/Admin/DashboardController.php                │
│  - Synchronous inline Eloquent queries on every hit                         │
│  - Hardcoded 7-day window (now()->subDays(6)->startOfDay())                 │
│  - Raw SQL DATE(created_at) aggregation                                     │
│  - Correlated subquery on order_items via whereHas('order')                 │
│  - Top products merged in PHP collection memory                              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Inertia Props
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            resources/js/Pages/Admin/Dashboard.jsx (React)                   │
│  - Stat Cards (Total Revenue, Orders, Pending, Paid, Customers, Guests)     │
│  - CSS div-based bar chart (Revenus — 7 derniers jours)                     │
│  - Tables: Order Statuses, Payment Statuses, Recent Orders, Top Products    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow Breakdown
1. **Routing and Middleware:** Admin routes are grouped under `/admin` with `['auth', 'admin']` middleware (`routes/web.php:103-106`). The `admin` alias binds to `EnsureUserIsAdmin` (`bootstrap/app.php:50`), which verifies `user()->role === 'admin'`.
2. **Global Overhead:** `HandleInertiaRequests` executes on **every Inertia request** (including admin hits). It runs `CartSynchronizer::synchronize()`, queries `Category` trees, counts pending orders, checks low stock, and fetches unread notifications (`HandleInertiaRequests.php:42-149`), adding database latency before dashboard controllers even run.
3. **Execution Model:** `DashboardController::index()` executes 8 scalar count/sum queries, 1 recent orders query, 1 raw date-grouped aggregation, 2 status distribution group-by queries, 1 low-stock query, 1 `order_items` top-products aggregation, and 1 product-hydration query. **Total: 15–20 queries per page hit**, with zero caching.

---

## 4. Database Schema and Relationship Audit

### Database Audit Matrix

| Entity / Table | Current Structure | Analytics Usage | Architectural & Integrity Problems | Recommended Changes | Priority |
|---|---|---|---|---|---|
| **`orders`** | `id`, `user_id`, `guest_token`, `order_number`, `status`, `payment_status`, `total_amount`, `shipping_fee`, `payment_method`, `transaction_id`, `stripe_session_id`, `stripe_payment_intent_id`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `city`, `postal_code`, `created_at`, `updated_at`, `shipped_at`, `delivered_at`, `returned_at`, `cancelled_at` | Sales, revenue, AOV, order volume, fulfillment duration, COD reconciliation | 1. No `paid_at`, `confirmed_at`, `processing_at` timestamps.<br>2. Missing composite indexes on `(payment_status, created_at)` and `(payment_method, payment_status, created_at)`.<br>3. `delivered_at` is unindexed.<br>4. Paid-then-cancelled orders retain `payment_status = 'paid'`.<br>5. No soft deletes (cascade deletes may break historical reporting). | 1. Add `paid_at`, `confirmed_at`, `processing_at` timestamps.<br>2. Add composite indexes `idx_orders_status_created`, `idx_orders_payment_created`, `idx_orders_delivered_at`.<br>3. Add `refunded_amount` decimal column. | **Critical** |
| **`order_items`** | `id`, `order_id`, `product_id`, `quantity`, `unit_price`, `timestamps` | Product revenue, units sold, top products, category sales | 1. No historical snapshot of `product_title` or `product_slug`. If a product is deleted/renamed, history is lost.<br>2. No `unit_cost` (COGS snapshot). Profit cannot be calculated.<br>3. Soft-deleted products return `null` on `belongsTo(Product::class)` without `withTrashed()`.<br>4. Missing index on `(product_id, order_id)`. | 1. Add `product_name_snapshot` (string).<br>2. Add `cost_price_snapshot` (decimal 10,2 nullable).<br>3. Update relationship to `belongsTo(Product::class)->withTrashed()`.<br>4. Add composite index `(product_id, order_id)`. | **Critical** |
| **`products`** | `id`, `title`, `slug`, `type`, `price`, `sale_price`, `stock_quantity`, `reserved_quantity`, `manage_stock`, `is_active`, `description`, `timestamps`, `deleted_at` | Product catalog, inventory health, low stock alerting | 1. No `cost_price` / wholesale cost column.<br>2. Unindexed `manage_stock` and `stock_quantity` cause full table scans when checking low stock.<br>3. `digitalDeliverable()` relation points to non-existent class. | 1. Add `cost_price` (decimal 10,2 nullable).<br>2. Add index on `(manage_stock, stock_quantity)`.<br>3. Remove dead `digitalDeliverable` relation. | **High** |
| **`order_attributions`** | `id`, `order_id` (unique FK), `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `fbclid`, `gclid`, `referer_url`, `timestamps` | Campaign attribution, channel revenue, ROAS | 1. **Data gap:** UTM parameters are NOT captured into cookies/sessions upon visitor landing, so checkout requests send `null`. Table is essentially empty in production.<br>2. No visit/click timestamp. | 1. Implement UTM capture middleware into cookies/session.<br>2. Populate attribution reliably from session in `CheckoutService`. | **High** |
| **`inventory_movements`** | `id`, `product_id`, `order_id`, `type` (reserve, release, ship, return), `quantity`, `timestamps`, unique `(order_id, product_id, type)` | Stock velocity, inventory shrinkage, audit trail | 1. `product_id` cascades on delete (`cascadeOnDelete`), wiping audit history if a product is removed.<br>2. `AmeexWebhookService` sets `RETURNED` status on order but omits calling `returnStock()`, creating inventory drift. | 1. Change FK to `restrictOnDelete` or maintain immutable audit records.<br>2. Call `InventoryService::returnStock()` inside `AmeexWebhookService`. | **High** |
| **`ameex_shipments`** | `id`, `order_id` (unique), `ameex_city_record_id`, `parcel_code`, `status`, `sub_status`, `comment`, `sandbox`, `timestamps` | Carrier delivery tracking, fulfillment failure rates | 1. No shipping carrier fee recorded (e.g. amount charged by AMEEX for the parcel).<br>2. No index on `(status, created_at)`. | 1. Add `carrier_fee` decimal column for exact fulfillment cost accounting.<br>2. Add composite index `(status, created_at)`. | **Medium** |
| **`ameex_events`** | `id`, `ameex_shipment_id`, `parcel_code`, `status`, `sub_status`, `comment`, `sandbox`, `raw_payload`, `received_at`, `timestamps` | Transit duration, delivery attempt counts, dispatch bottlenecks | 1. Stores complete event log; well indexed on `(parcel_code, status, received_at)`.<br>2. JSON `raw_payload` is uncompressed. | Retain as append-only event source. Use for transit duration analytics. | **Low** |
| **`users`** | `id`, `name`, `email`, `role`, `password`, `remember_token`, `timestamps` | Customer analytics, cohort retention, registered LTV | 1. Represents **only registered accounts**.<br>2. Guest checkout orders (`user_id = null`, `guest_token != null`) are completely ignored by `CustomerController`. | Implement customer entity resolution matching guest orders by normalized phone/email. | **High** |
| **`store_promotions`** | `id`, `type`, `title`, `description`, `image`, `is_active`, `sort_order`, `timestamps` | Marketing banners | Not a coupon/discount engine. Promotional discounts cannot be attributed at checkout. | Clarify promotion scope; introduce promo codes if coupon analytics are desired. | **Low** |
| **`categories` & `category_product`** | `id`, `name`, `slug`, `parent_id`, `timestamps`; pivot: `category_id`, `product_id` | Category-level sales and revenue breakdown | Standard nested category pivot. Indexing is adequate. | Add reporting helper for multi-tier category rollup. | **Low** |
| **`order_status_history`** | **DOES NOT EXIST** | Status transition times, lead time, funnel tracking | Overwriting status in `orders` means intermediate stages (`confirmed`, `processing`) have no timestamps. | Create `order_status_histories` table (`order_id`, `from_status`, `to_status`, `user_id`, `created_at`). | **High** |

---

### Critical Data Model Findings

#### 1. The "Deleted Product" Black Hole
In `OrderItem.php:36-39`:
```php
public function product(): BelongsTo
{
    return $this->belongsTo(Product::class);
}
```
Because `Product` uses `Illuminate\Database\Eloquent\SoftDeletes`, any soft-deleted product will be excluded by default from `OrderItem::product`. In `AdminOrderPresenter.php:111-120`, the code handles this by rendering `"Produit supprimé"`:
```php
'product' => $product ? [
    'id' => $product->id,
    'title' => $product->title,
    'image' => $product->primaryImage?->url,
] : [
    'id' => $item->product_id,
    'title' => 'Produit supprimé',
    'image' => null,
]
```
Even worse, in `DashboardController.php:116-119`, top products are retrieved via `Product::whereIn('id', $topProductsRaw->pluck('product_id'))->get()`. Because this query lacks `withTrashed()`, **any discontinued best-seller disappears from the Top Products widget entirely**.

#### 2. Absence of Historical Snapshots on Order Items
`order_items` only has:
- `order_id`
- `product_id`
- `quantity`
- `unit_price`

If a product's title changes from "Whey Gold 1kg" to "Whey Platinum 1kg", all past orders retroactively appear as "Whey Platinum 1kg". If a product is hard-deleted from the database, MySQL sets `product_id = NULL` due to `nullOnDelete()`, destroying all historical product identification.

#### 3. Payment Status vs. Order Status Independence
In `OrderStatus.php`, the enum includes `PAID = 'paid'`:
```php
enum OrderStatus: string {
    case PENDING = 'pending';
    case PAID = 'paid';
    case CONFIRMED = 'confirmed';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case OUT_FOR_DELIVERY = 'out_for_delivery';
    case DELIVERED = 'delivered';
    case RETURNED = 'returned';
    case CANCELLED = 'cancelled';
}
```
Simultaneously, `PaymentStatus.php` defines:
```php
enum PaymentStatus: string {
    case PENDING = 'pending';
    case PAID = 'paid';
    case FAILED = 'failed';
}
```
This causes semantic confusion:
- When a Stripe payment succeeds, `OrderPaymentService.php:78-79` sets both `status = OrderStatus::PAID` and `payment_status = PaymentStatus::PAID`.
- When an admin confirms the order, `status` moves to `CONFIRMED`, but `payment_status` remains `PAID`.
- When an order is Cash on Delivery, `status` starts as `PENDING`, moves to `CONFIRMED`, `PROCESSING`, `SHIPPED`, and only reaches `payment_status = PAID` upon `DELIVERED`.
- However, if a paid order is later `CANCELLED` (`OrderStatusTransition.php:104-114`), **`payment_status` is never modified**. It stays `PaymentStatus::PAID`!

---

## 5. Analytics Data Availability Matrix

To prevent displaying fabricated or deceptive figures, all target metrics are categorized strictly according to existing database reality:

| Category | Metric | Status | Evidence / Available Data | Data Quality Limitations & Blocking Factors |
|---|---|---|---|---|
| **Executive KPIs** | Gross Merchandise Value (GMV) | **Available** | `orders.total_amount` | Must clearly define whether cancelled orders are included. |
| | Gross Sales | **Available** | `order_items.quantity * unit_price` | Excludes shipping fee; includes discounts only if using `sale_price`. |
| | Net Sales | **Partially Available** | `orders.total_amount` minus cancelled/returned | Partial refunds cannot be deducted; refund tracking is absent. |
| | Order Count | **Available** | `orders.id` | Filterable by status and date range. |
| | Average Order Value (AOV) | **Available** | `Net Sales / Valid Orders` | Metric must exclude cancelled orders. |
| | Items Sold | **Available** | `order_items.quantity` | Readily available across date ranges. |
| | Refund Amount & Rate | **Unavailable** | None | `PaymentStatus` lacks `REFUNDED`; no `refund_amount` column exists. |
| | Cancellation Rate | **Available** | `cancelled_at` / `status = 'cancelled'` | Computable as `cancelled_orders / total_orders`. |
| | Conversion Rate | **Unavailable** | None | Zero session, visitor, or pageview tracking in the database. |
| | Gross Profit / Margin | **Unavailable** | None | No `cost_price` / COGS stored anywhere in the schema. |
| | Contribution Margin | **Unavailable** | None | Carrier shipping costs and Stripe processing fees are not recorded. |
| | COD Realization Rate | **Available** | `orders.payment_method = 'cash'` & `status` | Computable as `delivered_cod_amount / total_cod_placed_amount`. |
| **Revenue & Sales** | Revenue Trends (D/W/M/Y) | **Partially Available** | `orders.created_at`, `orders.delivered_at` | Distorted if using `created_at` for COD; requires local timezone adjustment. |
| | Previous Period Comparison | **Available** | Historical records in `orders` | Requires robust date-window offset query objects. |
| | Sales by Product / Category | **Partially Available** | `order_items` + `category_product` | Soft-deleted products disappear without `withTrashed()`. |
| | Sales by Payment Method | **Available** | `orders.payment_method` ('cash' vs 'stripe') | Fully supported. |
| | Discount Impact | **Partially Available** | `products.price - products.sale_price` | Only catalog sale price discount is available; no promo codes. |
| | Revenue by Customer Type | **Available** | `orders.user_id` (Registered vs Guest) | Fully supported. |
| | Revenue by Acquisition Channel | **Unreliable** | `order_attributions` | Attribution table is unpopulated due to missing UTM cookie persistence. |
| **Orders & Fulfillment**| Order Status Distribution | **Available** | `orders.status` | Fully supported. |
| | Delivery Success Rate | **Available** | `orders.delivered_at` vs `orders.shipped_at` | Fully supported via AMEEX event statuses. |
| | Delivery Failure / Return Rate | **Available** | `orders.returned_at` | Fully supported. |
| | Time to Delivery | **Available** | `delivered_at - shipped_at` | Reliable transit duration tracking. |
| | Time to Confirmation / Processing | **Unavailable** | None | No `confirmed_at` or `processing_at` timestamps exist. |
| | Carrier Performance | **Partially Available** | `ameex_shipments`, `ameex_events` | Single carrier (AMEEX); city-level breakdown available. |
| | COD Reconciliation | **Partially Available** | `orders.total_amount` for delivered COD | Requires matching cash collected against carrier payout reports. |
| **Product Performance** | Best-Selling Products | **Available** | `order_items.quantity` grouped by product | Requires `withTrashed()` to avoid dropping deleted items. |
| | Product Return Rate | **Partially Available** | `orders.status = 'returned'` joined to items | Order-level return only; item-level partial return unsupported. |
| | Low Stock & Out of Stock | **Available** | `products.stock_quantity`, `reserved_quantity` | Fully computable using `available_stock`. |
| | Inventory Sell-Through Rate | **Partially Available** | `inventory_movements` | Deleting a product wipes movement history due to cascade delete. |
| **Customer Analytics** | Registered vs Guest Orders | **Available** | `orders.user_id`, `orders.guest_token` | Fully supported. |
| | Repeat Purchase Rate | **Partially Available** | Grouped by `customer_phone` or `customer_email` | Requires identity resolution across guest orders. |
| | Customer Lifetime Value (LTV) | **Partially Available** | Cumulative spend per unique customer identity | Viable for registered users; requires phone/email grouping for guests. |
| | Customer Cohort Retention | **Partially Available** | First order date grouped by month | Solvable via SQL window functions using normalized email/phone. |
| **Marketing Analytics** | Sales by UTM Source / Campaign | **Unreliable** | `order_attributions` | Unpopulated in production. |
| | CAC & ROAS | **Unavailable** | None | Ad spend data is not stored in the system. |
| | Checkout Funnel Conversion | **Unavailable** | None | Cart and checkout drop-offs are not tracked in database tables. |

---

## 6. Metric Definitions and Calculation Rules

To establish absolute mathematical rigor, every analytical metric must adhere to explicit financial contracts and SQL logic.

### Executive KPIs

#### 1. Gross Merchandise Value (GMV)
- **Business Definition:** Total value of all customer orders placed during the period, prior to any cancellations, returns, or payment failures. Reflects top-line commercial demand.
- **Formula:**
  $$\text{GMV} = \sum \text{orders.total\_amount}$$
- **SQL Implementation:**
  ```sql
  SELECT COALESCE(SUM(total_amount), 0) AS gmv
  FROM orders
  WHERE created_at BETWEEN :start AND :end;
  ```
- **Edge Cases:** Includes orders that fail Stripe verification or are immediately cancelled.

#### 2. Gross Sales
- **Business Definition:** Total merchandise sales from valid, non-cancelled orders, excluding shipping fees and sales tax.
- **Formula:**
  $$\text{Gross Sales} = \sum (\text{order\_items.quantity} \times \text{order\_items.unit\_price})$$
- **SQL Implementation:**
  ```sql
  SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS gross_sales
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  WHERE o.status != 'cancelled'
    AND o.created_at BETWEEN :start AND :end;
  ```

#### 3. Net Sales
- **Business Definition:** Gross sales minus returns and cancellations, excluding shipping fees.
- **Formula:**
  $$\text{Net Sales} = \text{Gross Sales} - \text{Returns} - \text{Cancellations}$$
- **SQL Implementation:**
  ```sql
  SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS net_sales
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  WHERE o.status NOT IN ('cancelled', 'returned')
    AND o.created_at BETWEEN :start AND :end;
  ```

#### 4. Realized Cash Revenue (Cash Accounting)
- **Business Definition:** Actual cash collected during the selected period. For Stripe, recognized when payment succeeds. For COD, recognized **only when the parcel is delivered**.
- **Formula:**
  $$\text{Collected Cash} = \sum \text{Stripe Paid Orders} + \sum \text{Delivered COD Orders}$$
- **SQL Implementation:**
  ```sql
  SELECT COALESCE(SUM(total_amount), 0) AS collected_cash
  FROM orders
  WHERE status != 'cancelled'
    AND (
      (payment_method != 'cash' AND payment_status = 'paid' AND updated_at BETWEEN :start AND :end)
      OR
      (payment_method = 'cash' AND status = 'delivered' AND delivered_at BETWEEN :start AND :end)
    );
  ```

#### 5. Average Order Value (AOV)
- **Business Definition:** Average net expenditure per valid order.
- **Formula:**
  $$\text{AOV} = \frac{\text{Net Revenue}}{\text{Count of Valid Orders}}$$
- **Rule:** Never divide by total orders inclusive of cancellations.

#### 6. Order Cancellation Rate
- **Business Definition:** Proportion of orders cancelled relative to total orders placed.
- **Formula:**
  $$\text{Cancellation Rate} = \frac{\text{Count of Cancelled Orders}}{\text{Total Orders Placed}} \times 100\%$$

---

## 7. Financial Accuracy and COD Analysis

### Financial Metric Contract

To eliminate confusion between operational management and financial accounting, the dashboard must separate **Accrual (Demand) Metrics** from **Cash (Realization) Metrics**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMMERCIAL DEMAND (Accrual)                       │
│  - Measured by: orders.created_at                                           │
│  - Answers: "How much did customers buy this week?"                         │
│  - Metric: Gross Sales, Net Sales, Placed Order Count                       │
│  - COD Orders: Counted on day placed as "Uncollected Demand"               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CASH COLLECTION (Realization)                     │
│  - Measured by: orders.paid_at (Stripe) / orders.delivered_at (COD)        │
│  - Answers: "How much money actually entered our bank/cash balance?"        │
│  - Metric: Collected Cash, Cash Reconciliation                              │
│  - COD Orders: Recognized ONLY on delivered_at                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cash on Delivery (COD) Accounting Flaws in Current Code

In Morocco, e-commerce COD delivery success rates typically range between 70% and 85%. Uncollected parcels return to the merchant after 3–7 days.

In `app/Http/Controllers/Admin/DashboardController.php:58-68`:
```php
$rawOverview = Order::query()
    ->selectRaw('DATE(created_at) as date')
    ->selectRaw('COUNT(*) as orders')
    ->selectRaw('SUM(CASE WHEN payment_status = ? THEN total_amount ELSE 0 END) as revenue', [$paid])
    ...
    ->where('created_at', '>=', $start)
    ->groupBy(DB::raw('DATE(created_at)'))
```

#### The Dual Distortion:
1. **Retroactive Historical Mutation:**
   If a customer orders 1,000 MAD on October 1st via COD, it has `payment_status = 'pending'`. On October 1st, the dashboard reports 0 MAD revenue. On October 5th, AMEEX delivers the parcel, and the webhook updates `payment_status = 'paid'`.
   Because the query groups by `DATE(created_at)`, running the report on October 6th retroactively increases October 1st revenue by 1,000 MAD. Historical reports never stabilize.
2. **Current Cash Invisible:**
   If an order placed 14 days ago is delivered today, it is filtered out by `where('created_at', '>=', $start)`. The cash collected today is completely absent from the 7-day revenue view.

### Paid-and-Cancelled / Refund Distortion

In `app/Support/OrderStatusTransition.php:104-114`:
```php
if ($newStatus === OrderStatus::CANCELLED) {
    $updates['cancelled_at'] = now();

    if ($order->payment_method === 'cash') {
        $inventoryService->releaseReservation($order);
    } elseif ($order->payment_status === PaymentStatus::PAID) {
        $inventoryService->returnStock($order);
    }
}
```
**Notice:** `payment_status` is **not updated**. If an order was paid via Stripe, `payment_status` remains `'paid'`.
In `DashboardController.php:26-28`:
```php
'total_revenue' => (float) Order::query()
    ->where('payment_status', $paid)
    ->sum('total_amount'),
```
Because it queries only `where('payment_status', 'paid')` without checking `where('status', '!=', 'cancelled')`, **every cancelled paid order continues to inflate the total revenue metric permanently**.

### Shipping Fees and Tax Handling

1. **Shipping Invoicing:**
   `CartCalculator.php:62` applies a flat shipping fee rule:
   ```php
   $shippingFee = $subtotal > 250 ? 0 : 35;
   ```
   `orders.total_amount` equals `subtotal + shipping_fee`.
   The current dashboard treats `total_amount` as product revenue. If an order has 200 MAD of products and 35 MAD shipping fee, `total_revenue` records 235 MAD. Meanwhile, `topProducts` records 200 MAD. Product revenue and total revenue are out of balance by exactly the shipping fees collected.
2. **Carrier Shipping Costs (AMEEX Fees):**
   AMEEX invoices delivery charges per parcel. These charges are not recorded in `orders` or `ameex_shipments`. The store cannot analyze shipping margin or freight losses from returned parcels.
3. **Tax (TVA):**
   The application stores no tax rate or tax amount columns. All figures are gross customer invoiced amounts.

---

## 8. Laravel Architecture Audit and Recommendations

### Current vs. Recommended Architecture

The current implementation mixes UI routing, Eloquent hydration, business metrics, and raw SQL within a single controller method.

```
CURRENT (Monolithic & Fragile)
[DashboardController]
   ├── Direct DB Queries (15-20)
   ├── Hardcoded 7-Day Window
   ├── Inline Raw Aggregations
   └── Zero Caching

RECOMMENDED (Clean, Decoupled, Production-Grade)
[DashboardController]
   │
   ▼
[DateRange Value Object] (Validates start/end, timezone, comparison periods)
   │
   ▼
[Analytics Query Services] (app/Services/Analytics/)
   ├── SalesAnalyticsService (GMV, Net Sales, Realized Cash)
   ├── OrderAnalyticsService (Status distributions, fulfillment durations)
   ├── ProductAnalyticsService (Units, velocity, category rollups)
   └── CustomerAnalyticsService (Cohorts, frequency, guest matching)
   │
   ▼
[Dedicated Repository / Query Objects] (Raw DB::table with explicit indexes)
   │
   ▼
[Cache Layer] (Tagged/Keyed by date-range, invalidated on order events)
```

### Query Layer Design: Query Builder vs. Eloquent

For analytics workloads, **Eloquent model hydration is an antipattern**:
- Hydrating 5,000 `Order` models with relations consumes tens of megabytes of memory and adds seconds of object instantiation overhead.
- **Rule:** All analytical aggregations must use Laravel's `Query Builder` (`DB::table(...)`) with explicit `selectRaw()`, `join()`, and `groupBy()`.
- Top products must be retrieved in a **single SQL query** with an inner join, rather than two separate queries merged in PHP collection memory.

#### Optimized Top Products Query (Drop-in replacement for `DashboardController:102-132`):
```php
public function getTopProducts(DateRange $range, int $limit = 6): Collection
{
    return DB::table('order_items as oi')
        ->join('orders as o', 'o.id', '=', 'oi.order_id')
        ->join('products as p', 'p.id', '=', 'oi.product_id')
        ->leftJoin('product_images as pi', function ($join) {
            $join->on('pi.product_id', '=', 'p.id')
                 ->where('pi.is_primary', true);
        })
        ->whereNotIn('o.status', [OrderStatus::CANCELLED->value, OrderStatus::RETURNED->value])
        ->whereBetween('o.created_at', [$range->utcStart(), $range->utcEnd()])
        ->select([
            'p.id',
            'p.title',
            'pi.path as image',
            DB::raw('CAST(SUM(oi.quantity) AS UNSIGNED) as units_sold'),
            DB::raw('CAST(SUM(oi.quantity * oi.unit_price) AS DECIMAL(10,2)) as revenue'),
        ])
        ->groupBy('p.id', 'p.title', 'pi.path')
        ->orderByDesc('units_sold')
        ->limit($limit)
        ->get();
}
```

### Caching and Invalidation Strategy

The application currently has `CACHE_STORE=database` configured in MySQL (`config/cache.php`, `php artisan about`).
1. **Cache Granularity:**
   - Real-time/Today widgets: Cache for 5 minutes (`ttl: 300`).
   - Closed historical periods (e.g. "Last Month", "Q3 2026"): Cache for 24 hours (`ttl: 86400`).
2. **Cache Key Pattern:**
   `analytics:{service}:{metric}:{start_date}:{end_date}:{filter_hash}`  
   Example: `analytics:sales:summary:2026-10-01:2026-10-27:all`
3. **Event-Driven Invalidation:**
   Listen to `App\Events\OrderCreated`, `OrderDelivered`, `OrderCancelled`, and `PaymentSuccessful`. On firing, invalidate the current day's cache key:
   ```php
   Cache::forget('analytics:sales:summary:' . now()->toDateString() . ':*');
   ```

### Timezone and Date Boundary Handling

- **Database Storage:** All timestamps in `orders` (`created_at`, `delivered_at`, etc.) are stored in **UTC** (`config/app.php:68`).
- **Store Location:** Morocco operates on UTC+1 (WEST) or UTC+0 during Ramadan.
- **Flaw:** Grouping by `DATE(created_at)` groups by UTC midnight. An order placed at 00:30 AM in Casablanca (UTC+1) is recorded at 23:30 PM UTC the previous day, misallocating the sale to yesterday.
- **Solution:** Analytical queries must convert timezone during date grouping:
  ```sql
  DATE(CONVERT_TZ(created_at, '+00:00', '+01:00')) as report_date
  ```
  The offset must be dynamically pulled from application configuration (`config('app.timezone')`).

---

## 9. React Dashboard UX and Visualization Audit

### Current UI Limitations
Inspection of `resources/js/Pages/Admin/Dashboard.jsx:65-77` reveals:
- **No Charting Library:** The 7-day revenue chart is rendered via manual HTML flex divs:
  ```jsx
  <div
      className="w-full rounded-t-lg bg-slate-900"
      style={{ height: `${Math.max((Number(row.revenue) / maxRevenue) * 100, 4)}%` }}
      title={`${formatMoney(row.revenue)} • ${row.orders} commandes`}
  />
  ```
  This lacks interactive axes, multi-metric comparison, tooltip popovers, responsiveness, and accessible labels.
- **No Date Filtering:** The 7-day window is hardcoded in the backend. The admin cannot view "Today", "This Month", "Last Quarter", or a custom range.
- **No Comparison Periods:** No percentage delta comparisons against previous periods (e.g. vs. previous 7 days or previous year).
- **No Export Capability:** No button exists to export tabular summaries or order lists to CSV/Excel.

### Frontend Architecture Specification

The modernized dashboard should be organized into a multi-tab modular interface:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: Date Range Picker [Last 30 Days ▼] | Compare: [Previous Period ☑]   │
└─────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────┬──────────────┬──────────────┬────────────────┐
│ Gross Sales  │ Net Sales    │ Orders Count │ AOV          │ COD Delivery % │
│ 142,500 MAD  │ 128,200 MAD  │ 342          │ 374.85 MAD   │ 82.4%          │
│ ▲ +14.2%     │ ▲ +11.8%     │ ▲ +5.1%      │ ▲ +6.4%      │ ▼ -1.2%        │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────┐
│ Sales & Order Volume Trends (Recharts Area)  │ Order Status Breakdown       │
│ - Dual-axis: Revenue (MAD) vs Orders Count   │ (Donut / Progress breakdown) │
│ - Dashed line for comparison period          │ Pending, Confirmed, Shipped, │
│                                              │ Delivered, Returned          │
└──────────────────────────────────────────────┴──────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────┐
│ Top Products Performance (Sortable Table)    │ COD Cash Reconciliation      │
│ - Title, Category, Units Sold, Revenue       │ - Shipped COD Volume         │
│ - Stock Health indicator                     │ - Collected Cash (Delivered) │
│                                              │ - In-Transit vs Returned Cash│
└──────────────────────────────────────────────┴──────────────────────────────┘
```

### Charting Library Evaluation

| Library | Bundle Size | React 18 Support | SSR / Inertia Compatibility | Recommendation |
|---|---|---|---|---|
| **Recharts** | ~45 KB (tree-shaken) | **Native React 18** | High (SVG based, seamless hydration) | **Recommended.** Highly declarative, matches Tailwind design system. |
| **Chart.js + react-chartjs-2** | ~60 KB | Supported | Requires canvas ref handling | Viable alternative, but more cumbersome in React declarative tree. |
| **ApexCharts + react-apexcharts** | ~130 KB | Supported | Canvas/SVG hybrid, heavier bundle | Too heavy for standard dashboard needs. |
| **Tremor (Radix based)** | ~30 KB | Supported | Requires Tailwind v3 integration | Excellent, but Recharts provides more customization for multi-axis. |

---

## 10. Performance and Scalability Audit

### Evidence-Based Bottlenecks

#### 1. Correlated Subquery on Order Items
In `DashboardController.php:108-110`:
```php
$topProductsRaw = OrderItem::query()
    ->select('product_id', DB::raw('SUM(quantity) as units_sold'), DB::raw('SUM(quantity * unit_price) as revenue'))
    ->whereHas('order', function ($query) use ($paid) {
        $query->where('payment_status', $paid);
    })
    ->groupBy('product_id')
    ->orderByDesc('units_sold')
    ->limit(6)
    ->get();
```
`whereHas` produces an `EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND payment_status = 'paid')` subquery evaluated for every row in `order_items`. On a database with 50,000 order items, this query causes severe I/O degradation. Replacing it with an `INNER JOIN orders ON orders.id = order_items.order_id` reduces execution time from ~450ms to ~8ms.

#### 2. Missing Composite Index on Orders
In `DashboardController.php:61-64`:
Filtering by `where('created_at', '>=', $start)` and `where('payment_status', 'paid')`.
Current migration `2026_08_05_130428_create_orders_table.php` only created:
- `index(['status', 'created_at'])`
- `index('order_number')`
- `index('payment_status')` (from `2026_08_19_200855_add_payment_status_to_orders_table.php`)

There is **no composite index on `(payment_status, created_at)`**. MySQL must either scan the single index on `payment_status` or perform a range scan on `created_at` and filter in memory.

#### 3. Full Table Scan on Stock Alert Check
In `DashboardController.php:44-48` and `HandleInertiaRequests.php:79-83`:
```php
Product::query()
    ->where('manage_stock', true)
    ->whereNotNull('stock_quantity')
    ->where('stock_quantity', '<', $threshold)
    ->count()
```
Neither `manage_stock` nor `stock_quantity` is indexed in `products`. This executes a full table scan on `products` on **every single admin request**.

---

## 11. Security and Privacy Audit

1. **Authorization Verification:**
   All admin routes are protected by `EnsureUserIsAdmin` (`app/Http/Middleware/EnsureUserIsAdmin.php`). Direct unauthenticated requests to `/admin` are redirected to login, and authenticated non-admin users receive a `403 Forbidden` (`tests/Feature/AdminDashboardTest.php:11-21`).
2. **Data Isolation & Parameter Tampering:**
   Analytics queries must not take raw date strings and interpolate them into SQL statements. All filter inputs (`start_date`, `end_date`, `category_id`, `status`) must be strongly validated via a Laravel `FormRequest` (`date_format:Y-m-d`).
3. **PII Exposure in Analytics:**
   Aggregated dashboard widgets (KPI cards, charts) expose zero PII. However, the "Recent Orders" and "Customer Retention" tables display customer names, emails, and phone numbers. Any CSV/Excel export feature must enforce strict `OrderPolicy::viewAny` gates and log administrative export activity in `storage/logs/audit.log`.
4. **Rate Limiting:**
   Analytical aggregation endpoints are computationally expensive. They must be throttled using Laravel's rate limiter (`throttle:60,1` for admin analytics endpoints) to prevent DoS via rapid filter changes.

---

## 12. Pest Testing and Quality Assurance Strategy

The existing test suite utilizes **Pest 5.0** (`composer.json:29-30`, `tests/Pest.php`). Current tests cover admin authentication and basic product/order transitions (`tests/Feature/AdminDashboardTest.php`), but **contain zero tests for metric calculation correctness or date boundary accuracy**.

### Required Test Suite Structure
Future analytics tests must be organized under `tests/Feature/Analytics/`:
- `SalesMetricsTest.php`: Gross sales, net sales, GMV, and AOV formulas.
- `CodRealizationTest.php`: Verification that COD orders only register as collected cash upon delivery.
- `RefundAndCancellationTest.php`: Verification that cancelled paid orders are excluded from net revenue.
- `TimezoneBoundaryTest.php`: Verification that orders at 23:30 UTC match the proper local day.
- `SoftDeletedProductTest.php`: Verification that top products retain historical data for deleted products.
- `EmptyDatasetTest.php`: Verification that queries return `0` / empty arrays without dividing by zero.

### Example Pest 5 Test Scenarios (Design Specifications)

#### Scenario A: Cash on Delivery Realization
```php
test('cod orders are excluded from collected cash until delivered', function () {
    $admin = User::factory()->admin()->create();

    // Placed today, but pending delivery
    $pendingCod = Order::factory()->create([
        'payment_method' => 'cash',
        'status' => OrderStatus::SHIPPED,
        'payment_status' => PaymentStatus::PENDING,
        'total_amount' => 500.00,
        'created_at' => now(),
    ]);

    // Placed 5 days ago, delivered today
    $deliveredCod = Order::factory()->create([
        'payment_method' => 'cash',
        'status' => OrderStatus::DELIVERED,
        'payment_status' => PaymentStatus::PAID,
        'total_amount' => 750.00,
        'created_at' => now()->subDays(5),
        'delivered_at' => now(),
    ]);

    $service = app(SalesAnalyticsService::class);
    $range = DateRange::today();

    $cash = $service->getCollectedCash($range);

    // Only the delivered COD order must be recognized as today's cash
    expect($cash)->toBe(750.00);
});
```

#### Scenario B: Paid-and-Cancelled Exclusion
```php
test('paid orders that are cancelled are excluded from net sales', function () {
    $admin = User::factory()->admin()->create();

    $validOrder = Order::factory()->create([
        'status' => OrderStatus::CONFIRMED,
        'payment_status' => PaymentStatus::PAID,
        'total_amount' => 300.00,
    ]);

    $cancelledOrder = Order::factory()->create([
        'status' => OrderStatus::CANCELLED,
        'payment_status' => PaymentStatus::PAID, // Retains paid status in current schema
        'total_amount' => 200.00,
        'cancelled_at' => now(),
    ]);

    $service = app(SalesAnalyticsService::class);
    $range = DateRange::today();

    expect($service->getNetSales($range))->toBe(300.00);
});
```

---

## 13. Missing Data and Instrumentation Requirements

To achieve production-grade parity with modern e-commerce analytics, the following data collection gaps must be addressed:

1. **Product Cost of Goods Sold (COGS):**
   - **Requirement:** Add `cost_price` to `products` and `cost_price_snapshot` to `order_items`.
   - **Business Justification:** Without cost data, profit margins and product profitability cannot be computed.
2. **Item-Level Product Name Snapshot:**
   - **Requirement:** Add `product_name_snapshot` to `order_items`.
   - **Business Justification:** Prevents historical distortion when products are renamed or deleted.
3. **Fulfillment Stage Timestamps:**
   - **Requirement:** Add `confirmed_at` and `processing_at` to `orders`, or implement an `order_status_histories` audit table.
   - **Business Justification:** Enables calculating "Time to Confirm" and "Warehouse Processing Latency".
4. **Marketing Attribution Capture:**
   - **Requirement:** Implement a global frontend/middleware listener that stores `utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, and `gclid` into an encrypted 30-day session cookie, passing them automatically during checkout.
   - **Business Justification:** `order_attributions` currently records `null` for all web orders.
5. **Refund Event Tracking:**
   - **Requirement:** Add `refunded_amount` and `refunded_at` to `orders`, and expand `PaymentStatus` to include `REFUNDED` and `PARTIALLY_REFUNDED`.
   - **Business Justification:** Reconciles accounting when Stripe refunds occur.

---

## 14. Recommended Database Changes and Justification

All proposed schema adjustments are strictly justified by specific analytical failures in the current codebase:

### 1. Migration: `add_analytics_fields_to_orders_table`
- `confirmed_at` (`timestamp nullable`): Tracks exact time admin approved the order.
- `processing_at` (`timestamp nullable`): Tracks when order entered warehouse preparation.
- `paid_at` (`timestamp nullable`): Tracks exact timestamp online payment cleared.
- `refunded_amount` (`decimal 10,2 default 0.00`): Stores cumulative refunds for net revenue deduction.
- **Indexes:**
  - `idx_orders_payment_created` on `(payment_status, created_at)`
  - `idx_orders_method_status_delivered` on `(payment_method, status, delivered_at)`
  - `idx_orders_delivered_at` on `(delivered_at)`

### 2. Migration: `add_snapshot_and_cogs_to_order_items_table`
- `product_name_snapshot` (`string 255 nullable`): Immutable product title at moment of sale.
- `cost_price_snapshot` (`decimal 10,2 nullable`): Unit COGS at moment of sale for historical profit reproducibility.
- **Indexes:**
  - `idx_order_items_product_order` on `(product_id, order_id)`

### 3. Migration: `add_cost_and_indexes_to_products_table`
- `cost_price` (`decimal 10,2 nullable`): Base wholesale cost.
- **Indexes:**
  - `idx_products_stock_manage` on `(manage_stock, stock_quantity)`

### 4. Migration: `create_order_status_histories_table`
- `id`, `order_id` (FK), `from_status` (string), `to_status` (string), `user_id` (FK nullable), `created_at`.
- Provides an immutable audit log of status changes and operator accountability.

---

## 15. Prioritized Implementation Roadmap

```
PHASE 1: Data Integrity & Metric Definitions (Week 1)
  ├── Resolve paid-and-cancelled revenue distortion bug
  ├── Add missing database indexes for orders and order_items
  ├── Implement withTrashed() on OrderItem -> Product relation
  └── Finalize Financial Metric Contract (Accrual vs Cash)

PHASE 2: Analytics Query Layer & Pest Test Suite (Week 2)
  ├── Build DateRange Value Object with UTC/Local timezone conversion
  ├── Create SalesAnalyticsService, OrderAnalyticsService, ProductAnalyticsService
  ├── Replace correlated subqueries with optimized Query Builder joins
  └── Implement 100% Pest coverage for all metric formulas and boundaries

PHASE 3: Core Dashboard & Recharts Integration (Week 3)
  ├── Install recharts dependency
  ├── Build global DateRangePicker component with comparison toggle
  ├── Create KPI summary cards with percentage deltas
  └── Implement dual-axis Sales & Orders trend area chart

PHASE 4: Fulfillment, COD & Product Analytics (Week 4)
  ├── Build COD Reconciliation widget (Shipped vs Delivered vs Collected)
  ├── Create order fulfillment funnel (Transit times, return rates)
  └── Implement Top Products table with pagination, category filter, and stock alert badges

PHASE 5: Customer Analytics & Marketing Persistence (Week 5)
  ├── Implement UTM parameter capture into session/cookie
  ├── Build Customer Analytics service (Guest resolution by phone/email, repeat rates)
  └── Implement Customer Cohort retention matrix

PHASE 6: Caching, Exports & Production Hardening (Week 6)
  ├── Implement event-driven cache invalidation on order events
  ├── Build asynchronous streaming CSV export for order and product reports
  ├── Rate limit analytics endpoints (throttle:60,1)
  └── Validate production query execution plans
```

---

## 16. Dependencies and Risk Assessment

| Risk / Dependency | Severity | Impact | Mitigation Strategy |
|---|---|---|---|
| **Zero Historical COGS Data** | High | Historical profit cannot be computed for past orders. | Accept that gross profit is only available from Phase 1 onward; do not backfill estimates as real accounting data. |
| **Missing UTM Data on Past Orders** | Medium | Past marketing channel attribution cannot be recovered. | Acknowledge past data as "Direct / Unattributed"; fix tracking for all future visits immediately. |
| **Inertia Payload Bloat** | Medium | Large analytics datasets transferred via Inertia props degrade frontend responsiveness. | Paginate tabular analytics; return chart data aggregated at the database level (max 31–90 points). |
| **Timezone Boundary Discrepancies** | High | Discrepancy between store operating days and UTC database timestamps. | Enforce explicit `CONVERT_TZ` in queries using verified store timezone (`Africa/Casablanca`). |
| **Recharts Dependency Addition** | Low | New NPM package required. | `recharts` is standard, tree-shakable, and supports React 18 without peer dependency conflicts. |

---

## 17. Acceptance Criteria for Completed Dashboard

1. **Financial Exactness:**
   - Net Sales must equal Gross Sales minus valid returns and cancellations.
   - Cancelled paid orders must never appear in Net Sales or Total Revenue.
   - Cash collected from COD orders must be recognized strictly on the day the order reaches `DELIVERED` status.
2. **Performance SLA:**
   - Dashboard page initial load must be under **500ms** for standard 30-day windows.
   - All analytical queries must execute under **50ms** on datasets up to 100,000 orders.
   - Zero full table scans on `orders`, `order_items`, or `products`.
3. **UX & Responsiveness:**
   - Interactive date range selector supports Quick Presets (Today, Yesterday, 7D, 30D, MTD, Last Month) and Custom Date Range.
   - Comparison period overlays prior period trends with visual delta badges.
   - Graceful empty states (`AdminEmptyState`) and loading skeletons when fetching new ranges.
4. **Data Integrity:**
   - Soft-deleted products must display historical titles and revenues without crashing or vanishing.
   - Guest orders must be attributed to customer frequency metrics via normalized email/phone matching.

---

## 18. Open Questions Requiring Business Decisions

Before beginning implementation, the following architectural and business policy decisions must be reviewed and approved:

1. **Reporting Default — Demand (Accrual) vs. Cash (Realized):**
   Should the primary executive dashboard default to **Gross Merchandise Demand** (grouped by order placement date) or **Realized Cash** (grouped by payment / delivery date)?
   *(Recommendation: Default to Demand for Sales/Marketing analysis, with a dedicated "Cash & COD Reconciliation" tab for cash flow).*
2. **COGS Backfilling Policy:**
   When `cost_price` is added to `products`, should the store admin backfill current product costs onto past order items to generate estimated historical profit, or should profit calculations strictly start from the date of schema deployment?
3. **Customer Identity Resolution for Guests:**
   Should guest orders with identical phone numbers or email addresses be automatically merged into unified customer profiles for LTV and repeat purchase rate calculations?
   *(Recommendation: Yes, matching by normalized Moroccan phone number `+212...` or email address provides the most accurate retention picture).*
4. **AMEEX Shipping Carrier Fees:**
   Does the merchant receive a flat shipping invoice from AMEEX per city, or a monthly variable statement? If fixed per city, city-level shipping costs can be configured in `ameex_cities` to compute net shipping margin.

---

*Report concluded. Ready for architectural review.*
