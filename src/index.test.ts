import { describe, it, expect } from 'vitest'
import { createUser, createBook, calculateArea, getStatusColor, upperFirst, removeSpaces, getFirstElement, findById } from './index'


describe('User Functions', () => {
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

describe('Book Functions', () => {
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







