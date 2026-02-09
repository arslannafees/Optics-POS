/**
 * @file index.js
 * @description Registry for print-specific layouts and their sub-components.
 * 
 * This module exports both the main Laserjet (A4) and Thermal (80mm) 
 * layout orchestrators along with their constituent sub-components 
 * (headers, items, footers). 
 * 
 * Strategic Exports:
 * - Layout Orchestrators: PrintLayoutLaserjet, PrintLayoutThermal
 * - Laserjet Sections: Header, InfoBar, ItemsTable, Prescription, Footer
 * - Thermal Sections: Header, ItemsTable, Prescription, Footer
 * 
 * Built to satisfy strict project line-limit constraints while ensuring
 * high-fidelity print output for optical invoices and receipts.
 */

export * from "./PrintLayoutLaserjet";
export * from "./PrintLayoutThermal";
export * from "./LaserjetHeader";
export * from "./LaserjetInfoBar";
export * from "./LaserjetItemsTable";
export * from "./LaserjetPrescription";
export * from "./LaserjetFooter";
export * from "./ThermalHeader";
export * from "./ThermalItemsTable";
export * from "./ThermalPrescription";
export * from "./ThermalFooter";
