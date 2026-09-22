"use client";

export default function LinkedListNode({
    value,
    showPointer = false,
    className = "",
}) {
    return (
        <div
            className={`cell arrayDiv relative flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center px-2 font-semibold ${className}`}
        >
            {value}
            {showPointer && (
                <span
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-accent"
                    aria-hidden
                >
                    ▼
                </span>
            )}
        </div>
    );
}
