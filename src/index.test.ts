import { it, describe, expectTypeOf, expect } from 'vitest';
import { where, sort, groupBy, having, query } from './index';

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

describe('Ultra Query tests', () => {
  it('where', () => {
    const pipeline = query(where<User>()('surname', 'Doe'));
    expectTypeOf(pipeline).toBeCallableWith(users);
    const result = pipeline(users);

    expect(result).toHaveLength(2);
  });

  it('where + groupBy', () => {
    const pipeline = query(
      where<User>()('surname', 'Doe'),
      groupBy<User>()('city')
    );
    const result = pipeline(users);

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('NY');
    expect(result[0].items).toHaveLength(2);
  });

  it('where + groupBy + having', () => {
    const pipeline = query(
      where<User>()('surname', 'Doe'),
      groupBy<User>()('city'),
      having<User>()(g => g.items.length > 1)
    );
    const result = pipeline(users);

    expect(result).toHaveLength(1);
  });

  it('where + groupBy + having + sort', () => {
    const pipeline = query(
      where<User>()('surname', 'Doe'),
      groupBy<User>()('city'),
      having<User>()(g => g.items.length > 1),
      sort<User>()('age')
    );
    const result = pipeline(users);
    
    expect(Array.isArray(result)).toBe(true);
  });

  it('NO COMPILE having without groupBy', () => {
    const invalid = query(
      where<User>()('surname', 'Doe'),
      having<User>()(g => g.items.length > 1)
    );
  });

  it('NO COMPILE sort before groupBy', () => {
    const invalid = query(
      where<User>()('surname', 'Doe'),
      sort<User>()('age'),
      groupBy<User>()('city')
    );
  });

  it('should have stage properties', () => {
    const whereFn = where<User>()('name', 'John');
    const groupFn = groupBy<User>()('city');
    const havingFn = having<User>()(g => true);
    const sortFn = sort<User>()('age');

    expect((whereFn as any).stage).toBe('where');
    expect((groupFn as any).stage).toBe('groupBy');
    expect((havingFn as any).stage).toBe('having');
    expect((sortFn as any).stage).toBe('sort');
  });
});