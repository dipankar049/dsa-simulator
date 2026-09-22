"use client";

import OperationTabBar from "./OperationTabBar";

export default function ArrayWorkbench({
    tabs,
    activeTab,
    onTabChange,
    arrExist,
    elementCount,
    controlsDisabled = false,
    children,
}) {
    return (
        <div className="rounded-lg border border-border bg-bg p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">Build Array</h3>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    {arrExist ? `${elementCount} elements` : "No array yet"}
                </span>
            </div>

            <OperationTabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                arrExist={arrExist}
                disabled={controlsDisabled}
            />

            {children}
        </div>
    );
}
