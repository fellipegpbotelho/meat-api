"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on("beforeRender", document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get("/users", (req, res, next) => {
            users_model_1.User.find()
                .then(this.render(res, next))
                .catch(next);
        });
        application.get("/users/:id", (req, res, next) => {
            users_model_1.User.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next);
        });
        application.post("/users", (req, res, next) => {
            let user = new users_model_1.User(req.body);
            user
                .save()
                .then(this.render(res, next))
                .catch(next);
        });
        application.put("/users/:id", (req, res, next) => {
            const options = {
                overwrite: true,
                runValidators: true
            };
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(result => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Document not found");
                }
            })
                .then(this.render(res, next))
                .catch(next);
        });
        application.patch("/users/:id", (req, res, next) => {
            const options = { new: true, runValidators: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        });
        application.del("/users/:id", (req, res, next) => {
            users_model_1.User.remove({ _id: req.params.id })
                .exec()
                .then((commandResult) => {
                if (commandResult.result.n) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Document not found");
                }
                return next();
            })
                .catch(next);
        });
    }
}
exports.usersRoutes = new UsersRouter();
