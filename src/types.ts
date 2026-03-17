export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
}

export type PickedByType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
}

export type EventHandlers<T> = {
    [K in keyof T as `on${Capitalize<string & K>}`]?: T[K];
}