import Hapi from "@hapi/hapi";
import {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} from "./handler.js";

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route([
    {
      method: "POST",
      path: "/books",
      handler: addBookHandler,
    },
    {
      method: "GET",
      path: "/books",
      handler: getAllBooksHandler,
    },
    {
      method: "GET",
      path: "/books/{bookId}",
      handler: getBookByIdHandler,
    },
    {
      method: "PUT",
      path: "/books/{bookId}",
      handler: editBookByIdHandler,
    },
    {
      method: "DELETE",
      path: "/books/{bookId}",
      handler: deleteBookByIdHandler,
    },
  ]);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
