const express = require('express');
const BooksController = require('../controllers/books.controller');
const BooksService = require('../services/books.service');
const pool = require('../db/pool');

const router = express.Router();
const booksService = new BooksService(pool);
const booksController = new BooksController(booksService);
const { validateCreate, validateUpdate } = require('../middleware/validateBook');

router.post('/', validateCreate, booksController.createBook.bind(booksController));
router.get('/', booksController.getAllBooks.bind(booksController));
router.get('/:id', booksController.getBookById.bind(booksController));
router.put('/:id', validateUpdate, booksController.updateBook.bind(booksController));
router.delete('/:id', booksController.deleteBook.bind(booksController));

module.exports = router;