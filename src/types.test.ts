import { describe, test, expectTypeOf } from 'vitest';
import type { DeepReadonly, PickedByType, EventHandlers } from './types.js';

describe('Lab 6', () => {
    test('DeepReadOnly', () => {
        type readonlyUser = {
            name: string;
            param: {
                id: number;
                flag: { q: boolean };
            };
        };
        type ReadonlyObject = DeepReadonly<readonlyUser>;

        expectTypeOf<ReadonlyObject>().toMatchTypeOf<{
            readonly name: string;
            readonly param: {
                readonly id: number;
                readonly flag: { q: boolean };
            };
        }>();

        type IsReadonly = ReadonlyObject['param']['flag']['q'];
        expectTypeOf<IsReadonly>().toEqualTypeOf<boolean>();
    });

    test('PickedByType', () => {
        type User = {
            name: string;
            surname: string;
            id: number;
            age: number;
            isMale: boolean;
            isFemale: boolean;
        };
        type NumbersOnly = PickedByType<User, number>;
        expectTypeOf<NumbersOnly>().toEqualTypeOf<{
            id: number;
            age: number;
        }>();

        type StringsOnly = PickedByType<User, string>;
        expectTypeOf<StringsOnly>().toEqualTypeOf<{
            name: string;
            surname: string;
        }>();

        type BooleanOnly = PickedByType<User, boolean>;
        expectTypeOf<BooleanOnly>().toEqualTypeOf<{
            isMale: boolean;
            isFemale: boolean;
        }>();
    });

    test('EventHandlers', () => {
        type Events = {
            click: (event: MouseEvent) => void;
            change: (event: string) => void;
            submit: (event: { data: any }) => void;
        };
        type Handlers = EventHandlers<Events>;

        expectTypeOf<Handlers>().toMatchTypeOf<{
            onClick?: (event: MouseEvent) => void;
            onChange?: (event: string) => void;
            onSubmit?: (event: { data: any }) => void;
        }>();

        expectTypeOf<Handlers['onClick']>().parameters.toEqualTypeOf<[MouseEvent]>();
        expectTypeOf<Handlers['onClick']>().returns.toEqualTypeOf<void>();
    })
})