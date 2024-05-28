import { nanoid } from "nanoid";
import books from "./dataBuku.js";

export const addBookHandler = (request, h) => {
  const { payload } = request;

  if (!payload) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi data buku dengan benar.",
    });
    response.code(400);
    return response;
  }

  const { name, year, author, summary, publisher, pageCount, readPage } =
    request.payload;

  const yearNumber = Number(year);
  const pageCountNumber = Number(pageCount);
  const readPageNumber = Number(readPage);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (isNaN(yearNumber)) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Tahun harus berupa angka",
    });
    response.code(400);
    return response;
  }

  if (isNaN(pageCountNumber)) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Jumlah halaman harus berupa angka",
    });
    response.code(400);
    return response;
  }

  if (isNaN(readPageNumber)) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Halaman yang dibaca harus berupa angka",
    });
    response.code(400);
    return response;
  }

  if (readPageNumber > pageCountNumber) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const bookId = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    bookId,
    id: bookId,
    name,
    year: yearNumber,
    author,
    summary,
    publisher,
    pageCount: pageCountNumber,
    readPage: readPageNumber,
    finished: Boolean(readPageNumber === pageCountNumber),
    reading: Boolean(),
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.bookId === bookId).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: bookId,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

export const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    const nameRegex = new RegExp(name, "i");
    filteredBooks = filteredBooks.filter((book) => nameRegex.test(book.name));
  }

  if (reading !== undefined) {
    const isReading = reading === 1;
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === 1;
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  const response = h.response({
    status: "success",
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

export const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.bookId === bookId)[0];

  if (book) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

export const getBookByNameHandler = (request, h) => {
  const { name } = request.query;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal mendapatkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  const book = books.find((book) => book.name === name);

  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

export const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((note) => note.id === bookId); // find book by id

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

export const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};
