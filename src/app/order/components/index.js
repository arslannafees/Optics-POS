/**
 * @file index.js
 * @description Component exports for the Order List (/order) page.
 * 
 * Orchestrates the primary landing view for all sales and prescriptions.
 * Each component is isolated to maintain high maintainability and 
 * strict line-count adherence (20-60 lines).
 * 
 * Core View Components:
 * - OrderPageHeader: Handles title and top-level action buttons.
 * - OrderStats: Displays quick metrics (revenue, counts, status totals).
 * - OrderListColumns: Defines the complex DataTable column structures.
 * - OrderDeleteDialog: Safe confirmation flow for order removal.
 * 
 * These components are unified in OrderListPage.jsx.
 */

export * from "./OrderPageHeader";
export * from "./OrderStats";
export * from "./OrderListColumns";
export * from "./OrderDeleteDialog";
