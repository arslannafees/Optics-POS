"use client";

export const SPH_OPTIONS = Array.from({ length: 161 }, (_, i) =>
    (i * 0.25 - 20).toFixed(2).replace(/^-0.00$/, "0.00").replace(/^([^-+0])/, "+$1")
);
export const CYL_OPTIONS = Array.from({ length: 49 }, (_, i) =>
    (i * 0.25 - 6).toFixed(2).replace(/^-0.00$/, "0.00").replace(/^([^-+0])/, "+$1")
);
export const AXIS_OPTIONS = Array.from({ length: 180 }, (_, i) => (i + 1).toString());
export const ADD_OPTIONS = Array.from({ length: 12 }, (_, i) =>
    (i * 0.25 + 0.75).toFixed(2).replace(/^([^+])/, "+$1")
);
export const PRISM_OPTIONS = Array.from({ length: 41 }, (_, i) => (i * 0.25).toFixed(2));
export const BASE_OPTIONS = ["IN", "OUT", "UP", "DOWN", "BI", "BO", "BU", "BD"];
export const SEG_OPTIONS = Array.from({ length: 13 }, (_, i) => (i + 12).toString());
export const PD_TOTAL_OPTIONS = Array.from({ length: 21 }, (_, i) => (i + 54).toString());
export const PD_EYE_OPTIONS = Array.from({ length: 11 }, (_, i) => (i + 27).toString());
export const DIA_OPTIONS = Array.from({ length: 61 }, (_, i) => (i * 0.5 + 40).toFixed(1));
