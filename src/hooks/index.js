/**
 * @file index.js
 * @description Centralized export registry for custom React hooks.
 * 
 * These hooks encapsulate business logic for inventory, orders, 
 * dashboard analytics, and more. This layer ensures heavy 
 * side-effects and state management are separated from UI.
 */

export * from "./useOrderFormState";
export * from "./useOrderButtons";
export * from "./useOrderData";
export * from "./useOrderMutations";
export * from "./useOrderCalculations";
export * from "./useAccessories";
export * from "./useAccessoryForm";
export * from "./usePrescriptions";
export * from "./useDashboard";
export * from "./useDashboardAlerts";
export * from "./useOrderDetails";
export * from "./useOrders";
export * from "./useLenses";
export * from "./useShopsData";
export * from "./useBranchesData";
export * from "./useUserSync";
export * from "./useBarcodeScanner";
