"use client";

import React from "react";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PatientSearchAnimation: A beautiful, animated illustration for the 
 * empty state of the prescription search.
 * 
 * Features:
 * - Rotating dashed outer circle.
 * - Floating magnifying glass.
 * - Pulsing user icon bubble.
 * - Clean, professional aesthetic matching the theme.
 */
export function PatientSearchAnimation() {
    return (
        <div className="relative flex items-center justify-center w-64 h-64 mb-10 group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-110 group-hover:scale-125 transition-transform duration-1000" />

            {/* Pulsing Inner background */}
            <div className="absolute inset-8 bg-primary/[0.02] rounded-full animate-pulse" />

            {/* Rotating Dashed Circle */}
            <div className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />

            {/* Magnifying Glass Container */}
            <div className="relative z-10 flex items-center justify-center">
                <div className="p-8 bg-white/40 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 animate-float">
                    <Search className="w-16 h-16 text-primary/40 stroke-[1.5]" />
                </div>
            </div>

            {/* Floating User Icon Bubble */}
            <div className="absolute top-8 right-8 z-20">
                <div className="p-3.5 bg-white rounded-full shadow-[0_10px_25px_rgb(0,0,0,0.08)] border border-primary/10 animate-[bounce_4s_ease-in-out_infinite]">
                    <User className="w-6 h-6 text-primary stroke-[2]" />
                </div>
                {/* Ping animation behind bubble */}
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-25" />
            </div>

            {/* Small decorative circles */}
            <div className="absolute bottom-12 left-10 w-3 h-3 bg-primary/10 rounded-full animate-[ping_3s_ease-in-out_infinite] delay-700" />
            <div className="absolute top-20 left-12 w-2 h-2 bg-primary/20 rounded-full animate-[pulse_2.5s_ease-in-out_infinite]" />
            <div className="absolute bottom-20 right-10 w-2.5 h-2.5 bg-primary/10 rounded-full animate-[float_5s_ease-in-out_infinite] delay-1000" />
        </div>
    );
}
