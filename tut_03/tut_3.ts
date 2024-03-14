// Problem 1
interface Person {
    name: string;
    hobbies: string[];
}

interface Details {
    employed: boolean;
    profession: string;
}

function merge<T, U> (first: T, second: U,  mergeFunction: ((item: T & U) => T & U) = (item) => item
): T & U {
    const merged = {...first, ...second} 
    return mergeFunction(merged);
}

function addIsActive<T extends Person & Details>(item: T): T & { isActive: boolean } {
    return { ...item, isActive: true };
}

const person = { name: "Alice", hobbies: ["Reading", "Gaming"] };
const details = { employed: true, profession: "Engineer" };

const mergedResult = merge(person, details, addIsActive);
console.log(mergedResult);

// Problem 2
type SymbolIndex = {
    [key: symbol | string] : any
}

const now = new Date();

const uniqueID =  Symbol('uniqueID')
let description = Symbol("desc")
let time = Symbol("time")
let obj1: SymbolIndex = {
    uniqueID: "1234",
    description : "lorem ipsum here",
    time: now
};

console.log(obj1.uniqueID)
console.log(obj1.description)
console.log(obj1.time)

// Problem 3

class Book{
    constructor(
        private title: string,
        private author: string
    ) {}
}

class Library{
    protected books: Book[] = []
    constructor(
    ){}
    addBook(title: string, author:string) : void{
        let newBook = new Book(title, author)
        this.books.push(newBook)
    }
    getBooks(): Book[]{
        return this.books;
    }
}

let library = new Library()
library.addBook("Book 1", "Author 1")
library.addBook("Book 2", "Author 1")
library.addBook("Book 3", "Author 1")
let books = library.getBooks()
console.log(books)

// Problem 4