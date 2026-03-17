export type Transform<T> = (data: T[]) => T[];
export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;
export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;
export type Group<T, K extends keyof T> = {key: T[K], items: T[]};
export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;
export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];
export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

export function where<T>(): Where<T> {
    return (key, value) => (data) => data.filter((item) => item[key] === value);
}

export function sort<T>(): Sort<T> {
    return (key) => (data) => [...data].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
    });
}

export function groupBy<T>(): GroupBy<T> {
  return <K extends keyof T>(key: K) =>
    (data: T[]): Group<T, K>[] =>
      Object.values(
        data.reduce((acc, item) => {
          const k = String(item[key]); // ключ в объекте-аккумуляторе
          (acc[k] ??= { key: item[key], items: [] as T[] }).items.push(item);
          return acc;
        }, {} as Record<string, Group<T, K>>),
      );
}

export function having<T>(): Having<T> {
    return (predicate) => (groups) => groups.filter(predicate);
}

export function query<T>(...queries: Array<Transform<any> | GroupTransform<any, any>>): Transform<T> {
    return (data: T[]) => {
        let result: any = data;

        for(let q of queries) {
            result = q(result as any);
        }
        return result;
    }
}

type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 24, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 63, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 45, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 15, city: "LA" },
];

const whereUser = where<User>();
const sortUser = sort<User>();
const groupByUser = groupBy<User>();
const havingUser = having<User>();

const search = query<User>(
    whereUser("name", "John"),
    whereUser("surname", "Doe"),
    sortUser("age"),
);

const groupAndFilter = query<User>(
    groupByUser("city"),
    havingUser((g) => g.items.length > 1),
);

const pipeline = query<User>(
    whereUser("surname", "Doe"),
    groupByUser("city"),
    havingUser((group) => group.items.some((u) => u.age > 34)),
);

console.log("Полный массив юзерсов: ");
console.log(users);

console.log("\nУпорядоченный массив юзерсов: ")
const sorted = search(users);
console.log(sorted);

console.log("\nСгруппированный и отфильтрованный массив юзерсов:" )
const grouped = groupAndFilter(users);
console.log(grouped);

console.log("\nКомбинированный конвейер:" )
const pip = pipeline(users);
console.log(pip);
