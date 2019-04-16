import * as jestCli from "jest-cli";

import { Server } from "./server/server";
import { environment } from "./common/environment";

import { User } from "./users/users.model";
import { Review } from "./reviews/reviews.model";
import { usersRouter } from "./users/users.router";
import { reviewsRouter } from "./reviews/reviews.router";

let server: Server;

const beforeAllTests = () => {
  environment.db.url =
    process.env.DB_URL || "mongodb://localhost/meat-api-test-db";
  environment.server.port = process.env.SERVER_PORT || 3001;
  server = new Server();
  return server
    .bootstrap([usersRouter, reviewsRouter])
    .then(() => User.deleteMany({}).exec())
    .then(() => {
      let admin = new User();
      admin.name = "Admin";
      admin.email = "admin@email.com";
      admin.password = "123456";
      admin.profiles = ["admin", "user"];
      return admin.save();
    })
    .then(() => Review.deleteMany({}).exec());
};

const afterAllTests = () => server.shutdown();

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch(console.error);
