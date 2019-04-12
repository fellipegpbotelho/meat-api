import * as restify from "restify";

import { Server } from "./server/server";

import { usersRoutes } from "./users/users.router";

const server = new Server();
server
  .bootstrap([usersRoutes])
  .then(server => {
    console.log("Server is runnig on: ", server.application.address());
  })
  .catch(error => {
    process.exit(1);
  });
