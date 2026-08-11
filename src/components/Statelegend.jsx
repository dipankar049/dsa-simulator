import React from 'react';

/**
 * Small color-key strip shown under every sorting visualizer so learners can
 * map a cell's color back to what's happening in the algorithm right now.
 * `items` = [{ token: 'comparing', label: 'Comparing' }, ...]
 * `token` must match a --color-<token> CSS variable defined in theme.css.
 */
const StateLegend = ({ items }) => (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 pb-4 text-xs sm:text-sm text-secondary">
        {items.map(({ token, label }) => (
            <div key={token} className="flex items-center gap-2">
                <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: `rgb(var(--color-${token}))` }}
                />
                <span>{label}</span>
            </div>
        ))}
    </div>
);

export default StateLegend;