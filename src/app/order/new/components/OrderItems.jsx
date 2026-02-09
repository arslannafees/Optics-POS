"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NoData from "@/components/NoData";
import { OrderButtonTray } from "./OrderButtonTray";
import { OrderItemRow } from "./OrderItemRow";

export function OrderItems({ state, lists, settings, actions, dragActions }) {
    const { formData } = state;
    const { handleAddItem, handleRemoveItem, handleItemChange } = actions;

    return (
        <Card className="border shadow-none">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-2 pt-1.5 min-w-fit">
                        Order Items {formData.items.length > 0 && <Badge variant="secondary" className="text-xs">{formData.items.length}</Badge>}
                    </CardTitle>
                    <OrderButtonTray buttons={{ config: state.buttonConfig, setConfig: state.setButtonConfig, dragged: state.draggedType }}
                        customize={{ isCustomizing: state.isCustomizing, setIsCustomizing: state.setIsCustomizing }}
                        onAdd={(type) => handleAddItem(type, settings?.eyeCheckupFee)}
                        onDrag={dragActions} />
                </div>
            </CardHeader>
            <CardContent>
                {formData.items.length === 0 ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/5 border-muted-foreground/10">
                        <NoData message='No items added yet. Choose an item type above to start building this order.' />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {formData.items.map(item => (
                            <OrderItemRow key={item.id} item={item} lists={lists} settings={settings} onRemove={handleRemoveItem} onChange={handleItemChange} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
