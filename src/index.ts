type Transform<T> = (data: T[]) => T[];
type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;
type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;
type Group<T, K extends keyof T> = {key: T[K], items: T[]};
type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;
type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];
type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

function where<T>(): Where<T> {
    return (key, value) => (data) => data.filter((item) => item[key] === value);
}

function sort<T>(): Sort<T> {
    return (key) => (data) => [...data].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
    });
}

function groupBy<T>(): GroupBy<T> {
    return (key) => (data) => {
        return Object.values(
            data.reduce((acc, item) => {
                const k = item[key] as unknown as string;
                (acc[k] ??= { key: item[key], items: [] }).items.push(item);
                return acc;
            }, {} as Record<string, Group<T, typeof key>>)
        );
    };
}

function having<T>(): Having<T> {
    return (predicate) => (groups) => groups.filter(predicate);
}


        