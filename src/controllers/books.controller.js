class BooksController {
    constructor(booksService) {
        this.booksService = booksService;
    }

    async createBook(req, res, next) {
        try {
            const bookData = req.body;
            const newBook = await this.booksService.addBook(bookData);
            const { success } = require('../utils/response');
            return success(res, newBook, 201);
        } catch (error) {
            return next(error);
        }
    }

    async getAllBooks(req, res, next) {
        try {
            const books = await this.booksService.fetchAllBooks();
            const { success } = require('../utils/response');
            return success(res, books, 200);
        } catch (error) {
            return next(error);
        }
    }

    async getBookById(req, res, next) {
        try {
            const { id } = req.params;
            const book = await this.booksService.findBookById(id);
            const { success, fail } = require('../utils/response');
            if (!book) {
                return fail(res, 'Book not found', 404);
            }
            return success(res, book, 200);
        } catch (error) {
            return next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id } = req.params;
            const updatedBook = await this.booksService.updateBook(id, req.body);
            const { success, fail } = require('../utils/response');
            if (!updatedBook) {
                return fail(res, 'Book not found', 404);
            }
            return success(res, updatedBook, 200);
        } catch (error) {
            return next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            const deletedBook = await this.booksService.deleteBook(id);
            const { success, fail } = require('../utils/response');
            if (!deletedBook) {
                return fail(res, 'Book not found', 404);
            }
            return success(res, { message: 'Book deleted successfully' }, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = BooksController;