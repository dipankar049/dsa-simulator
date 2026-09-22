"use client";

export default function ArrayVisualization({
    items,
    getCellStyle,
    getCellTransform,
}) {
    return (
        <div
            className="grid w-fit grid-rows-2"
            style={{ gridTemplateColumns: `repeat(${items.length}, auto)` }}
        >
            {items.map((_, index) => (
                <div
                    key={`idx-${index}`}
                    className="flex h-5 w-10 shrink-0 items-center justify-center text-[10px] font-medium text-muted sm:h-6 sm:w-14 sm:text-xs"
                >
                    {index}
                </div>
            ))}

            {items.map((item, index) => {
                const { transform, transition } = getCellTransform
                    ? getCellTransform(index)
                    : { transform: undefined, transition: "none" };

                const transformValue = transform ?? "none";

                return (
                    <div
                        key={`cell-${index}`}
                        className={`cell arrayDiv relative h-8 w-10 shrink-0 text-xs font-semibold sm:h-11 sm:w-14 sm:text-base
              ${item === "NULL" ? "font-normal italic text-muted" : ""}
              ${transformValue !== "none" ? "z-10" : ""}`}
                        style={{
                            ...(getCellStyle ? getCellStyle(index) : {}),
                            transform,
                            transition,
                        }}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
}
