const express = require("express");
const fs = require("fs").promises;

const app = express();
const filePath = "../data/book.json";

app.listen(3000, () => {
  console.log("Server listening on port 3000.");
})

app.use(express.json());

const getAllBooks = async () => {
    const recipes = await fs.readFile(filePath, "utf8");
    return recipes;
  };
  
  const getBook = async (id) => {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data)[id];
  };
  
  
  const deleteBook = async (id) => {
    const data = await fs.readFile(filePath, "utf8");
    const recipes = JSON.parse(data).filter((recipe) => recipe.id !== id);
    const jsonRecipes = JSON.stringify(recipes, null, 2);
    await fs.writeFile(filePath, jsonRecipes);
  };
  
  
  const createNewBook = async (newRecipe) => {
    const data = await fs.readFile(filePath, "utf8");
    const recipe = [...JSON.parse(data), newRecipe];
    const jsonVersion = JSON.stringify(recipe, null, 2);
    await fs.writeFile(filePath, jsonVersion, "utf8");
  };
  
  const updateBook = async (id, updatedRecipe) => {
    const data = await fs.readFile(filePath, "utf8");
    const recipe = JSON.parse(data).map((recipe, i) => {
      return i === id ? updatedRecipe : recipe;
    });
  
    const jsonVersion = JSON.stringify(recipe, null, 2);
    await fs.writeFile(filePath, jsonVersion, "utf8");
  }
  
  app.get("/find-books", async (req, res) => {
    const books = await getAllBooks();
    res.send(books);
  });
  
  app.get("/find-book/:id", async (req, res) => {
    const id = Number(req.params.id);
    const book = await getBook(id);
    const jsonRecipe = JSON.stringify(book, null, 2);
    res.send(jsonRecipe);
  });
  
  app.delete("/trash-book/:id", async (req, res) => {
    const id = Number(req.params.id);
    await deleteBook(id);
    res.send("Recipe with " + id + " has been deleted.");
  });
  
  app.post("/create-book", async (req, res) => {
    await createNewBook({id: req.body.id, title: req.body.title, author: req.body.author, available: req.body.available});
    res.send("Recipe successfully written to the file!");
  });
  
  app.put("/update-book/:id", async (req, res) => {
    const updatedBook = {
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      available: req.body.available
    };
  
    await updateBook(Number(req.params.id), updatedBook);
    res.send(updatedBook);
  });