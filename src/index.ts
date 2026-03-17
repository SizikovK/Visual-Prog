export type Transform<T> = (data: T[]) => T[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export function where<T>(): Where<T> {
    return function<K extends keyof T>(key: K, value: T[K]): Transform<T> {
        return (data: T[]) => data.filter(item => item[key] === value);
    };
}

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export function sort<T>(): Sort<T> {
    return function<K extends keyof T>(key: K): Transform<T> {
        return (data: T[]) => [...data].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
    };
}

export type Group<T, K extends keyof T> = { key: T[K]; items: T[]; }

export type GroupBy<T> = <K extends keyof T>(key: K) => (data: T[]) => Group<T, K>[];

export function groupBy<T>(): GroupBy<T> {
    return function<K extends keyof T>(key: K) {
        return (data: T[]) => {
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
    };
}

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

export function having<T>(): Having<T> {
    return function<K extends keyof T>(predicate: (group: Group<T, K>) => boolean): GroupTransform<T, K> {
        return (groups: Group<T, K>[]) => groups.filter(predicate);
    };
}

export function query<T>(...steps: Function[]) {
    return (initialData: T[]): any => {
        return steps.reduce((currentData, step) => step(currentData), initialData);
    };
}