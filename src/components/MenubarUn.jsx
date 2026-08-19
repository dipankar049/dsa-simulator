"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    Squares2X2Icon,
    LinkIcon,
    MagnifyingGlassIcon,
    ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

const sections = [
    {
        label: "Overview",
        items: [{ label: "Home", to: "/", icon: HomeIcon }],
    },
    {
        label: "Data Structures",
        items: [
            { label: "Array", to: "/array-operations", icon: Squares2X2Icon },
            { label: "Linked List", to: "/linked-list-operations", icon: LinkIcon },
        ],
    },
    {
        label: "Searching",
        items: [
            { label: "Linear Search", to: "/linear-search", icon: MagnifyingGlassIcon },
            { label: "Binary Search", to: "/binary-search", icon: MagnifyingGlassIcon },
        ],
    },
    {
        label: "Sorting",
        items: [
            { label: "Bubble Sort", to: "/bubble-sort", icon: ArrowsUpDownIcon },
            { label: "Merge Sort", to: "/merge-sort", icon: ArrowsUpDownIcon },
            { label: "Quick Sort", to: "/quick-sort", icon: ArrowsUpDownIcon },
            { label: "Selection Sort", to: "/selection-sort", icon: ArrowsUpDownIcon },
        ],
    },
];

export default function MenubarUn({ isOpen, closeSidebar }) {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden md:block fixed w-1/6 h-[calc(100vh-4rem)] top-16 overflow-y-auto bg-surface border-r border-border">
                <SidebarContent pathname={pathname} />
            </div>

            {/* Mobile sidebar */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 top-16 bg-black/30 z-30 md:hidden"
                        onClick={closeSidebar}
                    />
                    <div className="fixed z-40 top-16 left-0 w-4/5 max-w-xs h-[calc(100vh-4rem)] overflow-y-auto bg-surface border-r border-border shadow-lg md:hidden">
                        <SidebarContent pathname={pathname} onNavigate={closeSidebar} />
                    </div>
                </>
            )}
        </>
    );
}

function SidebarContent({ pathname, onNavigate }) {
    return (
        <div className="p-3 space-y-5">
            {sections.map((section) => (
                <div key={section.label}>
                    <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                        {section.label}
                    </p>
                    <div className="space-y-0.5">
                        {section.items.map(({ label, to, icon: Icon }) => {
                            const active = pathname === to;
                            return (
                                <Link
                                    key={to}
                                    href={to}
                                    onClick={onNavigate}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active
                                            ? "bg-accent/10 text-accent font-semibold"
                                            : "text-ink-secondary hover:bg-element hover:text-ink"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-accent" : "text-ink-muted"}`} />
                                    <span className="truncate">{label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}