import { STEP_ICONS } from "./icons";

/**
 * @param {object|null} step - current simulation step
 * @param {Record<string, { iconKey: string, label: string, tone: string }>} actionMap
 * @param {string} [fallbackKey='default']
 */
export function resolveStepAction(step, actionMap, fallbackKey = "default") {
    if (!step) return null;

    const meta = actionMap[step.type] ?? actionMap[fallbackKey];
    if (!meta) return null;

    const Icon = STEP_ICONS[meta.iconKey] ?? STEP_ICONS.ArrowLeftRight;

    return {
        icon: Icon,
        label: meta.label,
        tone: meta.tone,
    };
}
