import * as restify from "restify";

import { Server } from "./server/server";

import { usersRouter } from "./users/users.router";
import { reviewsRouter } from "./reviews/reviews.router";
import { restaurantsRouter } from "./restaurants/restaurants.router";

const server = new Server();
server
  .bootstrap([usersRouter, restaurantsRouter, reviewsRouter])
  .then(server => {
    console.log("Server is runnig on: ", server.application.address());
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
