import "jest";
import * as request from "supertest";

import { Server } from "../server/server";
import { environment } from "../common/environment";
import { usersRouter } from "./users.router";
import { User } from "./users.model";

let baseUrl: string;
let server: Server;

beforeAll(() => {
  environment.db.url =
    process.env.DB_URL || "mongodb://localhost/meat-api-test-db";
  environment.server.port = process.env.SERVER_PORT || 3001;
  baseUrl = `http://localhost:${environment.server.port}`;
  server = new Server();
  return server
    .bootstrap([usersRouter])
    .then(() => User.deleteMany({}).exec())
    .catch(console.error);
});

test("get /users", () => {
  return request(baseUrl)
    .get("/users")
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});

test("post /users", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Cristiano Ronaldo",
      email: "cr7@gmail.com",
      password: "123456",
      cpf: "487.767.810-70"
    })
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("Cristiano Ronaldo");
      expect(response.body.email).toBe("cr7@gmail.com");
      expect(response.body.cpf).toBe("487.767.810-70");
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});

test("get /users/aaaa - not found", () => {
  return request(baseUrl)
    .get("/users/aaaa")
    .then(response => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});

test("patch /users/:id", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Luis Figo",
      email: "figo@gmail.com",
      password: "123456"
    })
    .then(response =>
      request(baseUrl)
        .patch(`/users/${response.body._id}`)
        .send({ name: "Luis Figo - Patch" })
    )
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("Luis Figo - Patch");
      expect(response.body.email).toBe("figo@gmail.com");
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});

afterAll(() => {
  return server.shutdown();
});
