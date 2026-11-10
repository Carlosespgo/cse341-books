import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../models/books.js';
import { authorExists } from '../models/authors.js';

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, title, authorId, publicationDate } = req.body;

    if (!id || !title || !authorId || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields' });
    }

    const exists = await authorExists(authorId);
    if (!exists) {
      return res.status(400).json({
        message: 'Author not found'
      });
    }

    const existingBook = await getBookById(id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists' });
    }

    const createdBook = await createBook({ id, title, authorId, publicationDate });
    return res.status(201).json(createdBook);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, authorId, publicationDate } = req.body;

    if (!title || !authorId || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields' });
    }

    const exists = await authorExists(authorId);
    if (!exists) {
      return res.status(400).json({
        message: 'Author not found'
      });
    }

    const existingBook = await getBookById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updatedBook = await updateBook(id, { title, authorId, publicationDate });
    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update book.' });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await getBookById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBook(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };