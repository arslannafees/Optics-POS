/**
 * @file index.js
 * @description Registry for Spectacle Lenses inventory components.
 * 
 * Exports the modular building blocks of the Lenses management view:
 * - LensPageHeader: Title and Add trigger.
 * - LensStats: KPI cards for inventory.
 * - LensListColumns: DataTable configuration.
 * - LensDeleteDialog: Confirmation flow.
 * - LensAddEditSheet: Data entry form.
 * 
 * Each component is isolated for maintainability and line-limit compliance.
 */

export * from "./LensPageHeader";
export * from "./LensStats";
export * from "./LensListColumns";
export * from "./LensDeleteDialog";
export * from "./LensAddEditSheet";
