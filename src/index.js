//imports modules(set of functions/ code commands that are pre-written/built in) needed to run the app
const express = require("express");
const fs = require("fs").promises;

const app = express();

app.listen(3000, () => {
    console.log("Server listening on port 3000.");
})

app.use(express.json());

// Retrieves all books

const getAllBooks = async() => {
    const books = await fs.readFile("../data/book.json", "utf8");

    return books;
};

//Retrieves one book at a specific id

const getBook = async(id) => {
    const data = await fs.readFile("../data/book.json", "utf8");

    const books = JSON.parse(data);
    
    return books.find((book, i) => i === id);
};

// Updates data for an existing book id

const updateBook = async(id, updatedBook) => {
    const data = await fs.readFile("../data/book.json", "utf8");
    const book = JSON.parse(data).map((book, i) => {
        return i === id ? updatedBook : book;
    });
    
    const jsonVersion = JSON.stringify(book, null, 2);
await fs.writeFile("../data/book.json", jsonVersion, "utf8");
};

// Creates a new book id

const createBook = async(title, author, available) => {
    const bookArray = await fs.readFile("../data/book.json", "utf8");
    const bookList = JSON.parse(bookArray);
    const newBook = {
        title: title,
        author: author, 
        available: available
    }
    bookList.push(newBook);
    const jsonAddNewBook = JSON.stringify(bookList, null, 2);
    await fs.writeFile("../data/book.json", jsonAddNewBook );
};

const deleteBook = async(id) => {
    const data = await fs.readFile("../data/book.json", "utf8");
    const books = JSON.parse(data).filter((book, i) => i !==id);
    const jsonBooks = JSON.stringify(books, null, 2);
    await fs.writeFile("../data/book.json", jsonBooks);
}





// API CALLS

// API call for finding all books

app.get("/get-all-books", async(req, res) => {
    const books = await getAllBooks();
    res.send(books);
});

// API call for finding one book at a specific id

app.get("/get-book/:id", async(req, res) => {
    const book = await getBook(Number(req.params.id));
    res.send(JSON.stringify(book));
});

// API call for updating content of a specific data point in JSON file

app.put("/update-book/:id", async(req, res) => {
    const updatedBook = {
        title: req.body.title,
        author: req.body.author,
        available: req.body.available,
      };
      await updateBook(Number(req.params.id), updatedBook);
      res.send(updatedBook);
    });

// API call for adding a new book to the JSON file

app.post("/create-book", async(req, res) => {
    await createBook(req.body.title, req.body.author, req.body.available);
    res.send("New book successfully written to the file!");

})

app.delete("/delete-book/:id", async (req, res) => {
    await deleteBook(Number(req.params.id));
    res.send("Successfully deleted book.");

  });