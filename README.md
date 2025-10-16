# Books API

This is a RESTful API for managing a collection of books. The API allows users to create, retrieve, update, and delete books from a PostgreSQL database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Migration](#database-migration)
- [Environment Variables](#environment-variables)

## Installation

1. Clone the repository:
  ```
  git clone <repository-url>
  cd books-api
  ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database connection details.

## Usage

To start the server, run:
```
npm start
```
The server will run on `http://localhost:3000`.

## API Endpoints

### 1. Create a Book
- **Endpoint:** `POST /api/books`
- **Description:** Adds a new book to the database.
- **Request Body (example):**
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "published_date": "2024-02-01",
    "isbn": "9781234567890",
    "pages": 320,
    "cover_image": "https://example.com/cover.jpg",
    "language": "en"
  }
  ```

### 2. Get All Books
- **Endpoint:** `GET /api/books`
- **Description:** Retrieves a list of all books in the database.

### 3. Get a Book by ID
- **Endpoint:** `GET /api/books/:id`
- **Description:** Retrieves a specific book by its ID.

### 4. Update a Book
- **Endpoint:** `PUT /api/books/:id`
- **Description:** Updates an existing book. Only provide the fields you want to change.

### 5. Delete a Book
- **Endpoint:** `DELETE /api/books/:id`
- **Description:** Deletes a book from the database.

## Database Migration

To create the `books` table in your PostgreSQL database, run the SQL migration script located in the `migrations` directory:
```
psql -U <username> -d books -f migrations/001_create_books_table.sql
```

## Environment Variables

The application requires the following environment variables, which can be set in a `.env` file based on the `.env.example` template:
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DATABASE_URL` *(optional)*: Use a full connection string instead of the fields above.

Make sure to replace the placeholders with your actual database credentials.