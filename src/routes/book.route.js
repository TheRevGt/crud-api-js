const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");
//middleware
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del libro no es válido",
    });
  }
  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "El libro no fue encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ messsage: error.message });
  }
  res.book = book;
  next();
};
// get books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ messsage: error.message });
  }
});
// create new book
router.post("/", async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  if (!title || !author || !genre || !publication_date) {
    return res.status(400).json({
      message: "Los camos titulo, autor, genero y fecha son obligatorios",
    });
  }
  const book = new Book({
    title,
    author,
    genre,
    publication_date,
  });
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ messsage: error.message });
  }
});
// get item
router.get("/:id", getBook, async (req, res) => {
  res.json(res.book);
});
// update
router.put("/:id", getBook, async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;

  if (!title || !author || !genre || !publication_date) {
    return res.status(400).json({
      message: "Los campos titulo, autor, genero y fecha son obligatorios",
    });
  }
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;
    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {}
  res.status(400).json({ messsage: error.message });
});
// parch
router.patch("/:id", getBook, async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  if (!title && !author && !genre && !publication_date) {
    return res.status(400).json({
      message:
        "Es necesario al menos uno de estos campos: titulo, Autor, Genero o fecha de publicacion",
    });
  }
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;
    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {}
  res.status(400).json({ messsage: error.message });
});

// delete
router.delete("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    await book.deleteOne({
      _id: book._id,
    });
    res.json({
      message: "El libre " + book.title + " fue eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
