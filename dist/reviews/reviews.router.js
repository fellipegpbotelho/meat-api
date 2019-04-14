"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
        this.findById = (req, res, next) => {
            this.model
                .findOne({ _id: req.params.id })
                .populate("user", "name")
                .populate("restaurant", "name")
                .then(this.render(res, next))
                .catch(next);
        };
    }
    envelop(document) {
        let resource = super.envelop(document);
        const restaurantId = document.restaurant._id
            ? document.restaurant._id
            : document.restaurant;
        resource._links.restaurant = `/restaurantes/${restaurantId}`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }
}
exports.reviewsRouter = new ReviewsRouter();
