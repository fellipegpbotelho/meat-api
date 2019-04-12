"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const server = new server_1.Server();
server
    .bootstrap()
    .then(server => {
    console.log("Server is runnig on: ", server.application.address());
})
    .catch(error => {
    process.exit(1);
});
