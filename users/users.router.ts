import * as restify from "restify";

import { Router } from "../common/router";
import { User } from "./users.model";

class UsersRouter extends Router {
  constructor() {
    super();
    this.on("beforeRender", document => {
      document.password = undefined;
    });
  }

  applyRoutes(application: restify.Server) {
    application.get("/users", (req, res, next) => {
      User.find().then(this.render(res, next));
    });

    application.post("/users", (req, res, next) => {
      let user = new User(req.body);
      user.save().then(this.render(res, next));
    });

    application.get("/users/:id", (req, res, next) => {
      User.findById(req.params.id).then(this.render(res, next));
    });

    application.put("/users/:id", (req, res, next) => {
      const options = {
        overwrite: true
      };
      User.update({ _id: req.params.id }, req.body, options)
        .exec()
        .then(result => {
          if (result.n) {
            return User.findById(req.params.id);
          } else {
            res.send(404);
          }
        })
        .then(this.render(res, next));
    });

    application.patch("/users/:id", (req, res, next) => {
      const options = { new: true };
      User.findByIdAndUpdate(req.params.id, req.body, options).then(
        this.render(res, next)
      );
    });

    application.del("/users/:id", (req, res, next) => {
      User.remove({ _id: req.params.id })
        .exec()
        .then((commandResult: any) => {
          if (commandResult.result.n) {
            res.send(204);
          } else {
            res.send(404);
          }
          return next();
        });
    });
  }
}

export const usersRoutes = new UsersRouter();
