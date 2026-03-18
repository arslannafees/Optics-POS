/**
 * @file WhatsAppPromptDialog.jsx
 * @description A centered dialog component for confirming WhatsApp notifications.
 */

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";

export function WhatsAppPromptDialog({ open, onOpenChange, customerName, message, onConfirm }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
                {/* Header with WhatsApp-style gradient/color */}
                <div className="bg-[#075E54] p-6 text-white">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <MessageCircle className="h-6 w-6 text-white fill-white/20" />
                            </div>
                            WhatsApp Notify
                        </DialogTitle>
                        <DialogDescription className="text-white/80 text-sm font-medium">
                            Send instant update to <span className="text-white underline decoration-[#25D366] decoration-2 underline-offset-4">{customerName}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 bg-[#f0f2f5] dark:bg-zinc-900/50">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Message Preview</p>
                        
                        {/* WhatsApp-style Chat Bubble */}
                        <div className="relative group animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-[#DCF8C6] dark:bg-[#056162] p-4 rounded-2xl rounded-tl-none shadow-sm border border-black/5 relative after:content-[''] after:absolute after:top-0 after:left-[-10px] after:border-[10px] after:border-transparent after:border-t-[#DCF8C6] dark:after:border-t-[#056162] after:border-r-[#DCF8C6] dark:after:border-r-[#056162]">
                                <p className="text-sm text-zinc-800 dark:text-zinc-100 leading-relaxed font-medium italic">
                                    "{message}"
                                </p>
                                <div className="flex justify-end items-center gap-1 mt-2">
                                    <span className="text-[10px] text-zinc-500/80 font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-500/10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 bg-[#f0f2f5] dark:bg-zinc-900/50 flex sm:justify-between items-center gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 transition-all font-medium"
                    >
                        Maybe Later
                    </Button>
                    <Button 
                        onClick={onConfirm} 
                        className="bg-[#075E54] hover:bg-[#054c44] text-white border-none shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 px-8 font-bold gap-2 rounded-xl"
                    >
                        <Send className="h-4 w-4" />
                        Send Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
