/**
 * @file index.js
 * @description Exports for modular components used in the Order Detail (view) page.
 * 
 * This directory contains the UI atoms and molecules that build up the 
 * single order viewing experience, ensuring each has its own focused file 
 * under the 60-line limit.
 * 
 * Exported Components:
 * - OrderDetailHeader: Back navigation and action buttons.
 * - OrderSummaryCard: Quick stats about the order (ID, date, status).
 * - OrderDetailItems: Table view for specific line items.
 * - OrderPrescriptionCard: Clinical prescription layout.
 * - OrderDetailCustomer: Customer identity and contact info.
 * - OrderDetailPayment: Comprehensive financial summary.
 * - OrderStatusBadge: Reusable colored status indicator.
 * - OrderPrescriptionEye: Metric-dense layouts for OD and OS.
 */

export * from "./OrderDetailHeader";
export * from "./OrderSummaryCard";
export * from "./OrderDetailItems";
export * from "./OrderPrescriptionCard";
export * from "./OrderDetailCustomer";
export * from "./OrderDetailPayment";
export * from "./OrderStatusBadge";
export * from "./OrderPrescriptionEye";
