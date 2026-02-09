/**
 * @file index.js
 * @description Centralized export point for components used in the New Order creation page.
 * 
 * Modular design for improved maintainability and strict line count compliance.
 * Each exported component corresponds to a specific section of the order creation flow.
 * 
 * Components included:
 * - NewOrderHeader: Handles page title and primary actions.
 * - CustomerInformation: Manages customer selection and order metadata.
 * - OrderItems: Orchestrates the item calculation and selection list.
 * - PrescriptionSection: Dedicated clinical data entry for optical orders.
 * - SummaryDetails: Displays subtotals, taxes, and final amounts.
 * - PaymentFields: Captures payment method and paid amount.
 */

export * from "./NewOrderHeader";
export * from "./CustomerInformation";
export * from "./OrderItems";
export * from "./PrescriptionSection";
export * from "./SummaryDetails";
export * from "./PaymentFields";
