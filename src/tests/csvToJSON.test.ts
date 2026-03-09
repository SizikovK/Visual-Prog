import { describe, it, expect } from 'vitest'
import { csvToJSON } from '../csvToJSON';

describe('csvToJSON function', () => {
    it('Корректный ввод параметров', () => {
        let res = csvToJSON(["p1;p2;p3", "1;A;b", "2;B;v"], ';');

        expect(res[0]).toEqual({ p1: 1, p2: 'A', p3: 'b' });
        expect(res[1]).toEqual({ p1: 2, p2: 'B', p3: 'v' });
        expect(res[0]).toHaveProperty('p1', 1);
        expect(res[0]).toHaveProperty('p2', 'A');
    });

    it('Передача неправильного массива', () => {
        expect(() => csvToJSON(["p1;p2;p3"], ';')).toThrowError('Некорректная передача параметра input!');
    });

    it('Нсовпадение параметров', () => {
        expect(() => csvToJSON(["p1;p2;p3", "1;A;b", "2;B"], ';')).toThrowError('Несовпадение по количеству параметров!');
    });

    it('Передача пустого параметра', () => {
        expect(() => csvToJSON(["p1;p2;p3", "1;A;b", "2;B;"], ';')).toThrowError('Передача пустого значения в параметр функции!');
    });
});