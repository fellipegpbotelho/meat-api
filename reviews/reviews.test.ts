import "jest";
import * as request from "supertest";

const baseUrl: string = (<any>global).baseUrl;

test("get /reviews", () => {
  return request(baseUrl)
    .get("/reviews")
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});
