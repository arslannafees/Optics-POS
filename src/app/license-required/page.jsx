"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Mail, Github } from "lucide-react";

export default function LicenseRequiredPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <ShieldAlert className="w-16 h-16 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">License Required</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        This is a trial version of the Optics POS. To continue using all features and remove this restriction, please contact the developer for a valid license.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Button size="lg" className="h-12 px-8" asChild>
          <a href="mailto:arslannafees@gmail.com">
            <Mail className="mr-2 h-5 w-5" />
            Contact for License
          </a>
        </Button>
        <Button size="lg" variant="outline" className="h-12 px-8" asChild>
          <a href="https://github.com/arslannafees" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-5 w-5" />
            GitHub Profile
          </a>
        </Button>
      </div>

      <div className="text-sm text-muted-foreground border-t pt-8 w-full max-w-md">
        <p>Developer: Arslan Nafees</p>
        <p>Traceability ID: Optics-POS-Trial-2026</p>
      </div>
    </div>
  );
}
