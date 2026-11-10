# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.


## Feature 2: Author CRUD Operations

### Goal
Create a complete Author API that supports all CRUD operations for authors. Author documents will be stored separately from books and will be referenced by books using the authorId field.

Every author route must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom id such as `a1`
- `firstName`: string, required
- `lastName`: string, required
- `birthDate`: string, required

Authors will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

Example author document:

`JSON`
    {
        "id": "a1",
        "firstName": "George",
        "lastName": "Orwell",
        "birthDate": "1903-06-25"
    }

### Relationship to Books

Books reference authors through the `authorId` field.
An author may have zero, one, or many books associated with them.
Before deleting an author, the API must check if any books exist with that author's id as their `authorId`.
If related books are found, the delete request must be rejected with a `400` status code.

### Routes

#### GET /authors

Purpose: Return all authors.

Success
- Status code: `200`
- Response body: an array of author objects

Example:

`JSON`
    [
        {
            "id": "a1",
            "firstName": "George",
            "lastName": "Orwell",
            "birthDate": "1903-06-25"
        }
    ] 

Errors
- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by its custom id.

Success
- Status code: `200`
- Response body: the matching author object

Example:

`JSON`
    {
        "id": "a1",
        "firstName": "George",
        "lastName": "Orwell",
        "birthDate": "1903-06-25"
    }

Errors
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request Body

`JSON`
    {
        "id": "a4",
        "firstName": "Jane",
        "lastName": "Austen",
        "birthDate": "1775-12-16"
    }

Success
- Status code: `201`
- Response body: the newly created author object

Example:

`JSON`
    {
        "id": "a4",
        "firstName": "Jane",
        "lastName": "Austen",
        "birthDate": "1775-12-16"
    }

Errors
- `400` if a required field is missing
- `400` if the id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request Body

`JSON`
    {
        "firstName": "Jane",
        "lastName": "Austen",
        "birthDate": "1775-12-16"
    }

Success
- Status code: `200`
- Response body: the updated author object

Example:

`JSON`
    {
        "id": "a4",
        "firstName": "Jane",
        "lastName": "Austen",
        "birthDate": "1775-12-16"
    }

Errors
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success
- Status code: `204`
- Response body: none

Errors
- `400` if the author still has one or more books associated with them
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

Example `400` response:

`JSON`
    {
        "message": "Cannot delete author because books are associated with this author."
    }

### Swagger Documentation

Swagger must document every author route.
The Swagger documentation must include:

- GET /authors
- GET /authors/{id}
- POST /authors
- PUT /authors/{id}
- DELETE /authors/{id}

Swagger request body examples should match the examples shown in this specification.

### Deployment Expectations

After implementation, the author routes must work locally and from the deployed Render application.
The deployed Swagger page at `/api-docs` must allow someone to test every author route directly from the browser.