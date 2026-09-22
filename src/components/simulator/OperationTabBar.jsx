"use client";

export default function OperationTabBar({
    tabs,
    activeTab,
    onTabChange,
    arrExist,
    disabled = false,
}) {
    return (
        <div className="mb-4 flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-0.5 sm:flex-nowrap sm:p-1">
            {tabs.map((tab) => {
                const tabDisabled = tab.id !== "create" && !arrExist;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        disabled={tabDisabled || disabled}
                        onClick={() => onTabChange(tab.id)}
                        className={`m-0.5 flex-1 basis-[calc(50%-4px)] rounded px-2 py-1.5 text-[10px] font-medium transition-colors sm:m-0 sm:basis-0 sm:px-3 sm:py-2 sm:text-sm
              ${activeTab === tab.id ? "bg-accent text-white" : "text-muted hover:bg-element hover:text-ink"}
              ${tabDisabled || disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted" : ""}`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
