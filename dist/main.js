"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const server = new server_1.Server();
server
    .bootstrap([users_router_1.usersRoutes])
    .then(server => {
    console.log("Server is runnig on: ", server.application.address());
})
    .catch(error => {
    process.exit(1);
});
