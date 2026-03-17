import { it, describe, expect } from 'vitest';
import { where, sort, groupBy, having, query } from './pipeline';

type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 30, city: "NY" },
    { id: 2, name: "Jane", surname: "Doe", age: 25, city: "NY" },
    { id: 3, name: "John", surname: "Indus", age: 47, city: "LA" },
    { id: 4, name: "Mike", surname: "Broflovski", age: 25, city: "LA" },
];

describe('My Types and Queryes tests', () => {
    describe('Transform Types', () => {
        it('where', () => {
            const filterJohn = where<User>()("name", "John");
            const result = filterJohn(users);
            expect(result).toHaveLength(2);
            expect(result.every(u => u.name === "John")).toBe(true);
        });

        it('sort', () => {
            const sortByAge = sort<User>()("age");
            const result = sortByAge(users);
            expect(result[0].age).toBe(25);
            expect(result[3].age).toBe(47);
        });

        it('groupBy', () => {
            const groupByCity = groupBy<User>()("city");
            const result = groupByCity(users);
            
            expect(result).toHaveLength(2);
            const nyGroup = result.find(g => g.key === "NY");
            expect(nyGroup?.items).toHaveLength(2);
        });

        it('having', () => {
            const groups = groupBy<User>()("city")(users);
            const filterGroups = having<User>()(g => g.items.some(u => u.age > 35));
            const result = filterGroups(groups);

            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("LA");
        });
    });

    describe('Query function', () => {
        it('should combine multiple where and sort steps', () => {
            const pipeline = query<User>(
                where<User>()("surname", "Doe"),
                sort<User>()("age")
            );
            const result = pipeline(users);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Jane");
            expect(result[1].name).toBe("John");
        });

        it('should execute a full pipeline', () => {
            const complexQuery = query<User>(
                where<User>()("surname", "Doe"),
                groupBy<User>()("city"),
                having<User>()(g => g.items.length > 1)
            );

            const result = complexQuery(users);

            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("NY");
            expect(result[0].items).toHaveLength(2);
        });

        it('should return []', () => {
            const pipeline = query<User>(
                where<User>()("name", "NonExistent")
            );
            expect(pipeline(users)).toEqual([]);
        });
    });
});