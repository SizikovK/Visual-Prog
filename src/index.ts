type WhereStage = { stage: 'where' };
type GroupByStage = { stage: 'groupBy' }; 
type HavingStage = { stage: 'having' };
type SortStage = { stage: 'sort' };

export type Transform<T> = (data: T[]) => T[];
export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T> & WhereStage;
export type Sort<T> = <K extends keyof T>(key: K) => Transform<T> & SortStage;
export type Group<T, K extends keyof T> = { key: T[K]; items: T[]; }
export type GroupBy<T> = <K extends keyof T>(key: K) => ((data: T[]) => Group<T, K>[]) & GroupByStage;
export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];
export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K> & HavingStage;

export function where<T>(): Where<T> {
    return function<K extends keyof T>(key: K, value: T[K]): Transform<T> & WhereStage {
        const fn = (data: T[]) => data.filter(item => item[key] === value);
        (fn as any).stage = 'where';
        return fn as Transform<T> & WhereStage;
    };
}


export function sort<T>(): Sort<T> {
    return function<K extends keyof T>(key: K): Transform<T> & SortStage {
        const fn = (data: T[]) => [...data].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        (fn as any).stage = 'sort';
        return fn as Transform<T> & SortStage;
    };
}


export function groupBy<T>(): GroupBy<T> {
    return function<K extends keyof T>(key: K) {
        const fn = (data: T[]) => {
            const map = new Map<T[K], Group<T, K>>();
            data.forEach(item => {
                const val = item[key];
                if (!map.has(val)) {
                    map.set(val, { key: val, items: [] });
                }
                map.get(val)!.items.push(item);
            });
            return Array.from(map.values());
        };
        (fn as any).stage = 'groupBy';
        return fn as any;
    };
}

export function having<T>(): Having<T> {
    return function<K extends keyof T>(predicate: (group: Group<T, K>) => boolean): GroupTransform<T, K> & HavingStage {
        const fn = (groups: Group<T, K>[]) => groups.filter(predicate);
        (fn as any).stage = 'having';
        return fn as GroupTransform<T, K> & HavingStage;
    };
}

type Stage = 'where' | 'groupBy' | 'having' | 'sort';

type NextStages<Prev extends Stage | ''> =
    Prev extends '' ? 'where' :
    Prev extends 'where' ? 'where' | 'groupBy' :
    Prev extends 'groupBy' ? 'groupBy' | 'having' :
    Prev extends 'having' ? 'having' | 'sort' :
    Prev extends 'sort' ? 'sort' :
    never;

type ValidateStages<T extends any[], Prev extends Stage | '' = ''> =
    T extends [infer First, ...infer Rest]
        ? First extends { stage: infer S }
            ? S extends Stage
                ? S extends NextStages<Prev>
                    ? ValidateStages<Rest, S>
                    : false
                : false
            : false
        : true;

export type ValidateOrder<T extends any[]> =
    ValidateStages<T> extends true ? T : never;

export function query<TItem, TSteps extends any[]>(...steps: ValidateOrder<TSteps>) {
    return (initialData: TItem[]) =>
        steps.reduce((current, step) => step(current), initialData);
}