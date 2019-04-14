import * as restify from "restify";

import { Server } from "./server/server";

import { usersRoutes } from "./users/users.router";
import { restaurantsRouter } from "./restaurants/restaurants.router";

const server = new Server();
server
  .bootstrap([usersRoutes, restaurantsRouter])
  .then(server => {
    console.log("Server is runnig on: ", server.application.address());
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
