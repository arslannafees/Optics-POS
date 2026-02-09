import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function PdTypeToggle({ value, settings, onChange }) {
    return (
        <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground px-1">PD Type</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-8 text-[10px] uppercase font-bold bg-muted/30 border-white/10">
                    <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="single" className="text-[10px] uppercase font-bold">Single</SelectItem>
                    <SelectItem value="dual" className="text-[10px] uppercase font-bold">Dual (Per-Eye)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
