import { describe, it, expect } from 'vitest'
import { createUser, createBook, calculateArea, getStatusColor, upperFirst, removeSpaces, getFirstElement, findById } from './index'


describe('createUser function', () => {
    it('createUser с передачей всех полей', () => {
        const user = createUser(28, "Paige", "bookworm@curce.ca");
        expect(user.email).toBe("bookworm@curce.ca");
    });

    it('createUser без email', () => {
        const user = createUser(28, "Paige");
        expect(user).toEqual({
            id: 28,
            name: "Paige",
            isActive: true
        });
        expect(user.email).toBeUndefined();
    });
});

describe('createBook function', () => {
    it('createBook возвращает переданный объект', () => {
        const inputBook = {
            title: "Kizaru",
            author: "Kia Rio", 
            genre: "fiction" as const,
            year: 2027
        }
        const result = createBook(inputBook)
        expect(result).toStrictEqual(inputBook)
    });
});

describe('calculateArea перегрузки', () => {
    it('calculateArea: cilcle', () => {
        const area = calculateArea('circle', { radius: 10 });
        expect(area).toBeCloseTo(314, 1);
    });

    it('calculateArea: square', () => {
        const area = calculateArea('square', { side: 10 });
        expect(area).toBe(100);
    });

    it('calculateArea: zero value', () => {
        const area = calculateArea('circle', { radius: 0 });
        expect(area).toBe(0);
    });
});

describe('getStatusColor function', () => {
    it('getStatusColor: active -> green', () => {
        const color = getStatusColor('active');
        expect(color).toBe('\x1b[32mgreen\x1b[0m');
        //expect(color).toBe('green');
    });

    it('getStatusColor: inactive -> gray', () => {
        const color = getStatusColor('inactive');
        expect(color).toBe('\x1b[90mgray\x1b[0m');
        //expect(color).toBe('gray');
    });

    it('getStatusColor: new -> yellow', () => {
        const color = getStatusColor('new');
        expect(color).toBe('\x1b[33myellow\x1b[0m');
        //expect(color).toBe('yellow');
    });

    it('getStatusColor: deleted -> red', () => {
        const color = getStatusColor('deleted');
        expect(color).toBe('\x1b[31mred\x1b[0m');
        //expect(color).toBe('red');
    });
});

describe('upperFirst funtion', () => {
    it('upperFirst: normal val', () => {
        let str = "konfetka raz dva tri";
        str = upperFirst(str, false);
        expect(str).toBe("Konfetka raz dva tri");
    });

    it('upperFirst: uppercase check', () => {
        let str = "konfetka raz dva tri";
        str = upperFirst(str, true);
        expect(str).toBe("KONFETKA RAZ DVA TRI");
    });

    it('upperFirst: zero val', () => {
        let str;
        str = upperFirst(str, false);
        expect(str).toBe('');
    });
});

describe('removeSpaces function', () => {
    it('removeSpaces: normal val', () => {
        let str = "      konfetka    ";
        str = removeSpaces(str, false);
        expect(str).toBe("konfetka");
    });

    it('removeSpaces: uppercase check', () => {
        let str = "      konfetka    ";
        str = removeSpaces(str, true);
        expect(str).toBe("KONFETKA");
    });

    it('removeSpaces: zero val', () => {
        let str;
        str = removeSpaces(str, false);
        expect(str).toBe('');
    });
});

describe('getFirstElement function', () => {
    it('getFirstElement: normal arr', () => {
        let arr: number[] = [1, 2, 3, 4];
        let num = getFirstElement(arr);
        expect(num).toBe(1);
    });

    it('getFirstElement: empty arr', () => {
        let arr: number[] = [];
        let num = getFirstElement(arr);
        expect(num).toBeUndefined();
    });
});

interface HasID {
    id: number;
    name: string;
}

describe('findById function', () => {
    let arr: HasID[] = [
        {id: 1, name: "Светка"},
        {id: 2, name: "Викусик"},
        {id: 3, name: "Кирюшка"}
    ];

    it('findById: normal val', () => {
        const user = findById(arr, 2);
        expect(user).toEqual({
            id: 2, 
            name: "Викусик" 
        });
    });

    it('findById: wrong val', () => {
        const user = findById(arr, 222);
        expect(user).toBeUndefined();
    });
});







