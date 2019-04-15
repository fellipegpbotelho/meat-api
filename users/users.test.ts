import "jest";
import * as request from "supertest";

const baseUrl: string = (<any>global).baseUrl;

test("get /users - list", () => {
  return request(baseUrl)
    .get("/users")
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});

test("get /users - findByEmail", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Tony Stark",
      email: "tony.stark@gmail.com",
      password: "123456"
    })
    .then(response =>
      request(baseUrl)
        .get("/users")
        .query({ email: "tony.stark@gmail.com" })
    )
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].email).toBe("tony.stark@gmail.com");
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

test("get /users/:id - single", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Pavel Nedved",
      email: "nedved@gmail.com",
      password: "123456",
      cpf: "482.326.154-27"
    })
    .then(response => request(baseUrl).get(`/users/${response.body._id}`))
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Pavel Nedved");
      expect(response.body.email).toBe("nedved@gmail.com");
      expect(response.body.cpf).toBe("482.326.154-27");
      expect(response.body.password).toBeUndefined();
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

test("post /users - required name", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      email: "leo@gmail.com",
      password: "123456",
      cpf: "675.028.852-93"
    })
    .then(response => {
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors[0].message).toContain("name");
    })
    .catch(fail);
});

test("post /users - duplicate email", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Fernando",
      email: "fernando@gmail.com",
      password: "123456",
      cpf: "593.436.344-12"
    })
    .then(response =>
      request(baseUrl)
        .post("/users")
        .send({
          name: "Fernando",
          email: "fernando@gmail.com",
          password: "123456",
          cpf: "593.436.344-12"
        })
    )
    .then(response => {
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("E11000 duplicate key");
    })
    .catch(fail);
});

test("post /users - invalid cpf", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Liliana Bolton",
      email: "lilianabolton@gmail.com",
      password: "123456",
      cpf: "675.028.222-93"
    })
    .then(response => {
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].message).toContain("Invalid CPF");
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

test("patch /users/aaaa - not found", () => {
  return request(baseUrl)
    .patch("/users/aaaa")
    .then(response => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});

test("put /users:/id", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Pocahontas",
      email: "pocahontas@gmail.com",
      password: "123456",
      cpf: "613.586.318-59",
      gender: "Male"
    })
    .then(response =>
      request(baseUrl)
        .put(`/users/${response.body._id}`)
        .send({
          name: "Pocahontas",
          email: "pocahontas@gmail.com",
          password: "123456",
          cpf: "613.586.318-59"
        })
    )
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Pocahontas");
      expect(response.body.email).toBe("pocahontas@gmail.com");
      expect(response.body.cpf).toBe("613.586.318-59");
      expect(response.body.gender).toBeUndefined();
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});

test("put /users/aaaa - not found", () => {
  return request(baseUrl)
    .put("/users/aaaa")
    .then(response => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});

test("delete /users/:id", () => {
  return request(baseUrl)
    .post("/users")
    .send({
      name: "Naruto Uzumaki",
      email: "naturo123@gmail.com",
      password: "123456",
      cpf: "187.638.581-26"
    })
    .then(response => request(baseUrl).delete(`/users/${response.body._id}`))
    .then(response => {
      expect(response.status).toBe(204);
    })
    .catch(fail);
});

test("delete /users/aaaaa - not found", () => {
  return request(baseUrl)
    .delete("/users/aaaaa")
    .then(response => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});
