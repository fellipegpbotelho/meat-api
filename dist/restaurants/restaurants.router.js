"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const restaurants_model_1 = require("./restaurants.model");
const model_router_1 = require("../common/model-router");
const authz_handler_1 = require("../security/authz.handler");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
                .then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError("Restaurant not found");
                }
                else {
                    res.json(restaurant.menu);
                    return next();
                }
            })
                .catch(next);
        };
        this.replaceMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError("Restaurant not found");
                }
                else {
                    restaurant.menu = req.body;
                    return restaurant.save();
                }
            })
                .then(restaurant => {
                res.json(restaurant.menu);
                return next();
            })
                .catch(next);
        };
    }
    envelop(document) {
        let resource = super.envelop(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize("admin"), this.save]);
        application.put(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.replace
        ]);
        application.patch(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.update
        ]);
        application.del(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.delete
        ]);
        application.get(`${this.basePath}/:id/menu`, [
            this.validateId,
            this.findMenu
        ]);
        application.put(`${this.basePath}/:id/menu`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.replaceMenu
        ]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
