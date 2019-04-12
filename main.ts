import { Server } from "./server/server";

const server = new Server();
server
  .bootstrap()
  .then(server => {
    console.log("Server is runnig on: ", server.application.address());
  })
  .catch(error => {
    process.exit(1);
  });
