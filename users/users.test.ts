import "jest";
import * as request from "supertest";

const baseUrl: string = (<any>global).baseUrl;

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
