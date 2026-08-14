import type { Costing } from './valhalla';

/**
 * Declarative description of the Valhalla costing options we expose, so the UI
 * can be generated rather than hand-written per profile.
 *
 * Defaults mirror Valhalla's own, which keeps the panel honest: what you see is
 * what the router will use. Unknown keys are ignored by Valhalla, so sending a
 * full set costs nothing.
 *
 * @see https://valhalla.github.io/valhalla/api/turn-by-turn/api-reference/#costing-options
 */
export type OptionSpec =
    | { key: string; kind: 'ratio'; label: string; help?: string; default: number; fork?: boolean }
    | { key: string; kind: 'number'; label: string; help?: string; default: number; min: number; max: number; step: number; unit?: string; fork?: boolean }
    | { key: string; kind: 'select'; label: string; help?: string; default: string; options: string[]; fork?: boolean }
    | { key: string; kind: 'toggle'; label: string; help?: string; default: boolean; fork?: boolean };

export type CostingValues = Record<string, number | string | boolean>;

const FERRY: OptionSpec = { key: 'use_ferry', kind: 'ratio', label: 'use_ferry', help: 'Willingness to take a ferry', default: 0.5 };
const LIVING_STREETS = (value: number): OptionSpec => ({
    key: 'use_living_streets',
    kind: 'ratio',
    label: 'use_living_streets',
    help: 'Willingness to use living streets',
    default: value
});
const SHORTEST: OptionSpec = { key: 'shortest', kind: 'toggle', label: 'shortest', help: 'Ignore time and take the shortest path', default: false };

const MOTORISED: OptionSpec[] = [
    { key: 'use_highways', kind: 'ratio', label: 'use_highways', help: 'Willingness to take motorways', default: 1 },
    { key: 'use_tolls', kind: 'ratio', label: 'use_tolls', help: 'Willingness to take toll roads', default: 0.5 },
    { key: 'use_tracks', kind: 'ratio', label: 'use_tracks', help: 'Willingness to use rough tracks', default: 0 },
    FERRY,
    LIVING_STREETS(0.1),
    { key: 'top_speed', kind: 'number', label: 'top_speed', help: 'Speed cap for the vehicle', default: 140, min: 10, max: 252, step: 5, unit: 'km/h' },
    SHORTEST
];

export const COSTING_SPECS: Record<Costing, OptionSpec[]> = {
    auto: MOTORISED,
    bus: MOTORISED,
    truck: [
        ...MOTORISED,
        { key: 'height', kind: 'number', label: 'height', default: 4.11, min: 1, max: 10, step: 0.01, unit: 'm' },
        { key: 'width', kind: 'number', label: 'width', default: 2.6, min: 1, max: 5, step: 0.01, unit: 'm' },
        { key: 'length', kind: 'number', label: 'length', default: 21.64, min: 1, max: 50, step: 0.01, unit: 'm' },
        { key: 'weight', kind: 'number', label: 'weight', default: 21.77, min: 1, max: 100, step: 0.01, unit: 't' },
        { key: 'hazmat', kind: 'toggle', label: 'hazmat', help: 'Carrying hazardous materials', default: false }
    ],
    motorcycle: [
        ...MOTORISED,
        { key: 'use_trails', kind: 'ratio', label: 'use_trails', help: 'Willingness to take unpaved trails', default: 0 }
    ],
    motor_scooter: [
        { key: 'use_primary', kind: 'ratio', label: 'use_primary', help: 'Willingness to use primary roads', default: 0.5 },
        { key: 'use_hills', kind: 'ratio', label: 'use_hills', help: 'Willingness to take on hills', default: 0.5 },
        FERRY,
        LIVING_STREETS(0.1),
        { key: 'top_speed', kind: 'number', label: 'top_speed', default: 45, min: 10, max: 120, step: 5, unit: 'km/h' },
        SHORTEST
    ],
    bicycle: [
        { key: 'bicycle_type', kind: 'select', label: 'bicycle_type', default: 'Hybrid', options: ['Road', 'Hybrid', 'City', 'Cross', 'Mountain'] },
        { key: 'cycling_speed', kind: 'number', label: 'cycling_speed', help: 'Speed on smooth, flat roads', default: 20, min: 5, max: 60, step: 0.5, unit: 'km/h' },
        { key: 'use_roads', kind: 'ratio', label: 'use_roads', help: '0 avoids roads, 1 ignores cycle-friendliness', default: 0.5 },
        { key: 'use_hills', kind: 'ratio', label: 'use_hills', help: '0 avoids hills, 1 ignores grade', default: 0.5 },
        { key: 'avoid_bad_surfaces', kind: 'ratio', label: 'avoid_bad_surfaces', help: '1 refuses surfaces the bicycle type cannot handle', default: 0.25 },
        FERRY,
        LIVING_STREETS(0.5),
        {
            key: 'non_network_penalty',
            kind: 'number',
            label: 'non_network_penalty',
            help: 'Seconds added to edges outside a cycling network. Only exists on a patched Valhalla; stock builds ignore it.',
            default: 0,
            min: 0,
            max: 600,
            step: 5,
            unit: 's',
            fork: true
        },
        SHORTEST
    ],
    pedestrian: [
        { key: 'walking_speed', kind: 'number', label: 'walking_speed', default: 5.1, min: 0.5, max: 25, step: 0.1, unit: 'km/h' },
        { key: 'use_hills', kind: 'ratio', label: 'use_hills', help: '0 avoids hills', default: 0.5 },
        FERRY,
        LIVING_STREETS(0.6),
        { key: 'max_hiking_difficulty', kind: 'number', label: 'max_hiking_difficulty', help: 'Highest sac_scale accepted', default: 1, min: 0, max: 6, step: 1 },
        SHORTEST
    ]
};

export function defaultsFor(costing: Costing): CostingValues {
    const values: CostingValues = {};
    for (const spec of COSTING_SPECS[costing] || []) {
        values[spec.key] = spec.default;
    }
    return values;
}

/** Fills in any option the stored settings do not carry yet. */
export function withDefaults(costing: Costing, stored: CostingValues | undefined): CostingValues {
    return { ...defaultsFor(costing), ...(stored || {}) };
}

export function isDefault(costing: Costing, key: string, value: unknown) {
    return (COSTING_SPECS[costing] || []).find((spec) => spec.key === key)?.default === value;
}

/** Shapes the values into the `costing_options` block Valhalla expects. */
export function toCostingOptions(costing: Costing, values: CostingValues | undefined) {
    const merged = withDefaults(costing, values);
    return { [costing]: merged };
}
