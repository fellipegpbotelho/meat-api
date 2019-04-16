import * as restify from "restify";
import { NotFoundError } from "restify-errors";

import { Review } from "./reviews.model";
import { ModelRouter } from "../common/model-router";
import { authorize } from "../security/authz.handler";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  envelop(document) {
    let resource = super.envelop(document);
    const restaurantId = document.restaurant._id
      ? document.restaurant._id
      : document.restaurant;
    resource._links.restaurant = `/restaurantes/${restaurantId}`;
    return resource;
  }

  findById = (req, res, next) => {
    this.model
      .findOne({ _id: req.params.id })
      .populate("user", "name")
      .populate("restaurant", "name")
      .then(this.render(res, next))
      .catch(next);
  };

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll);
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    application.post(`${this.basePath}`, [authorize("user"), this.save]);
  }
}

export const reviewsRouter = new ReviewsRouter();
