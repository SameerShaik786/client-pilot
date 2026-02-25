import { cn } from "@/lib/utils";

export function Spinner({ className, label = "Loading..." }) {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className={cn("w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin", className)} />
            <p className="text-xs font-medium text-neutral-500">{label}</p>
        </div>
    );
}
