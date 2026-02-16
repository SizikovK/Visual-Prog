// ==== 1. Интерфейс Юзер =====

interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function createUser(userId: number, userName: string, userEmail?: string) : User {
    return { id: userId, name: userName, email: userEmail, isActive: true };
}

function printUser(user: User) : void {
    console.log(`Id: ${user.id}`);
    console.log(`Name: ${user.name}`);
    if(user.email != undefined) {
        console.log(`Email: ${user.email}`);
    }
}

const user1 = createUser(19, "MrBeast");
const user2 = createUser(13, "Isaak", "pleasedontbiteme@mama.kz");

console.log("Данные о User1:")
printUser(user1);
console.log("\nДанные о User2:")
printUser(user2);

// ===== 2. Интерфейс книга ======

type Genre = 'fiction' | 'non-fiction';

interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

export function createBook(book: Book) : Book {
    return book;
}

export function printBook(book: Book) : void {
    console.log(`Title: ${book.title}`);
    console.log(`Author: ${book.author}`);
    if(book.year != undefined) {
        console.log(`Year: ${book.year}`);
    }
    console.log(`Genre: ${book.genre}`);
}

const book1: Book = {
    title: "Kizaru Dejavu",
    author: "Kizaru",
    genre: "non-fiction",
    year: 2022
};

const book2: Book = {
    title: "Совершенный код",
    author: "Егор Трутнев",
    genre: "non-fiction",
};

const ex1 = createBook(book1);
const ex2 = createBook(book2);

console.log("\nДанные о ex1:");
printBook(ex1);
console.log("\nДанные о ex2:");
printBook(ex2);


// ===== 3. Фигуры ======

export function calculateArea(shape: 'circle', param: { radius: number }) : number;
export function calculateArea(shape: 'square', param: { side: number }) : number;

export function calculateArea(shape: 'circle' | 'square', param: { radius?: number; side?: number }) : number {
    if(shape == "circle") {
        const r = param.radius ?? 0;
        return 3.14 * r * r;
    }
    else {
        const s = param.side ?? 0;
        return s * s;
    }
}

const circle = calculateArea('circle', { radius: 15 });
const square = calculateArea('square', { side: 5 });

console.log(`\nCircle Area: ${circle}`);
console.log(`Square Area: ${square}`);

// ===== 4. Status ======

type Status = 'active' | 'inactive' | 'new' | 'deleted';

const statusColor: Record<Status, string> = {
    //active: 'green',
    //inactive: 'gray',
    //new: 'yellow'
    //deleted: 'red'

    active: '\x1b[32mgreen\x1b[0m',
    inactive: '\x1b[90mgray\x1b[0m',
    new: '\x1b[33myellow\x1b[0m',
    deleted: '\x1b[31mred\x1b[0m'
};

export function getStatusColor(status: Status) : string {
    return statusColor[status];
}

console.log("\nactive: " + getStatusColor('active'));
console.log("inactive: " + getStatusColor('inactive'));
console.log("new: " + getStatusColor('new'));
console.log("deleted: " + getStatusColor('deleted'));

// ====== 5. StringFormatter ======

type StringFormatter = (value: string, uppercase?: boolean) => string;

export const upperFirst: StringFormatter = (value, uppercase = false) => {
    if(!value) return '';
    let res = value[0].toUpperCase() + value.slice(1);

    if(uppercase) {
        res = res.toUpperCase();
    }

    return res;
}

export const removeSpaces: StringFormatter = (value, uppercase = false) => {
    if(!value) return '';
    let res = value.trim();

    if(uppercase) {
        res = res.toUpperCase();
    }

    return res;
}

let stroka = "maybe baby";
let stroka2 = "   new year   ";

console.log("\nupperFirst: \"" + stroka + "\" ---> \"" + upperFirst(stroka) + "\"");
console.log("upperFirst: \"" + stroka + "\" ---> \"" + upperFirst(stroka, true) + "\"");

console.log("removeSpaces: \"" + stroka2 + "\" ---> \"" + removeSpaces(stroka2) + "\"");
console.log("removeSpaces: \"" + stroka2 + "\" ---> \"" + removeSpaces(stroka2, true) + "\"");

// ======= 6. getFirstElement =======

export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr.length > 0 ? arr[0] : undefined;
}

let numbarr: number[] = [10, 20, 21, 30, 99];
let strarr: string[] = ["Один", "Два", "Три", "Четыре"];
let emp_arr: number[] = [];

let num0 = getFirstElement(numbarr);
let str0 = getFirstElement(strarr);
let num0_emp = getFirstElement(emp_arr);

console.log("\nnumbarr: " + num0);
console.log("strarr: " + str0);
console.log("emp_arr: " + num0_emp);

// ======= 7. интерфейс HasId =======

interface HasID {
    id: number;
    name: string;
}

export function findById<T extends HasID>(items: T[], id: number) : T | undefined {
    for(const item of items) {
        if(item.id === id) {
            return item;
        }
    }
    return undefined;
}

let objarr: HasID[] = [
    {id: 1, name: "Светка"},
    {id: 2, name: "Викусик"},
    {id: 3, name: "Кирюшка"}
];

console.log("\ntry id = 1: " + findById(objarr, 1)?.name);
console.log("try id = 4: " + findById(objarr, 4)?.name);
console.log("try id = 3: " + findById(objarr, 3)?.name);






