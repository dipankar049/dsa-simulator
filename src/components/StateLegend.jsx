export default function StateLegend({ items = [] }) {
    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 pb-4 text-xs sm:text-sm text-secondary">
            {items.map(({ token, label }) => (
                <div key={token} className="flex items-center gap-2">
                    <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: `rgb(var(--color-${token}))` }}
                    />
                    <span>{label}</span>
                </div>
            ))}
        </div>
    );
}