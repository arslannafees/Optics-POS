/**
 * @file index.js
 * @description Export registry for Purchases module components.
 * 
 * Components:
 * - PurchasePageHeader: Main title and "New" action.
 * - PurchaseStats: Inventory summary metrics.
 * - PurchaseListColumns: DataTable configuration.
 * - PurchaseAddEditSheet: Main data entry sheet.
 * - PurchaseViewDialog: Detailed record viewer.
 * - PurchaseDeleteDialog: Removal confirmation.
 * - PurchasePaymentDialog: Payment recorder.
 * - QuickAddItemDialog: On-the-fly inventory creation.
 * 
 * Each component adheres to the project's 20-60 line limit.
 */

export * from "./PurchasePageHeader";
export * from "./PurchaseStats";
export * from "./PurchaseListColumns";
export * from "./PurchaseAddEditSheet";
export * from "./PurchaseViewDialog";
export * from "./PurchaseDeleteDialog";
export * from "./PurchasePaymentDialog";
export * from "./QuickAddItemDialog";
