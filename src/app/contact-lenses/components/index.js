/**
 * @file index.js
 * @description Export registry for Contact Lenses module UI components.
 * 
 * This module follows the atomic design pattern by breaking down the 
 * contact lens inventory view into small, focused, and reusable parts.
 * 
 * Components:
 * - ContactLensHeader: Renders title and "Add" action.
 * - ContactLensStats: Renders inventory summary cards.
 * - ContactLensColumns: Defines the layout for the DataTable.
 * - ContactLensDeleteDialog: Handles deletion confirmation flow.
 * - ContactLensAddEditSheet: Manages the data entry side-sheet.
 * 
 * All components in this directory adhere to the 20-60 line limit.
 */

export * from "./ContactLensHeader";
export * from "./ContactLensStats";
export * from "./ContactLensColumns";
export * from "./ContactLensDeleteDialog";
export * from "./ContactLensAddEditSheet";
